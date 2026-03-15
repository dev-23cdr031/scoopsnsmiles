"""
FastAPI server for Sakthi Bakers AI API.

Start:
  python main.py            # runs on http://localhost:8000
  uvicorn main:app --reload # dev mode
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, json, os
import pandas as pd

from ml_models import ProductionPlanner, IngredientForecaster
from data_generator import PRODUCTS

# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(title="Sakthi Bakers AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load models ─────────────────────────────────────────────────────────────

MODEL_DIR = "saved_models"
DATA_DIR = "data"

demand_predictor = None
bestseller_results = None
rec_engine = None
sales_df = None
products_info = None


def _load():
    global demand_predictor, bestseller_results, rec_engine, sales_df, products_info
    if os.path.exists(f"{MODEL_DIR}/demand_predictor.pkl"):
        demand_predictor = joblib.load(f"{MODEL_DIR}/demand_predictor.pkl")
    if os.path.exists(f"{MODEL_DIR}/bestseller_results.json"):
        with open(f"{MODEL_DIR}/bestseller_results.json") as f:
            bestseller_results = json.load(f)
    if os.path.exists(f"{MODEL_DIR}/recommendation_engine.pkl"):
        rec_engine = joblib.load(f"{MODEL_DIR}/recommendation_engine.pkl")
    if os.path.exists(f"{DATA_DIR}/sales_data.csv"):
        sales_df = pd.read_csv(f"{DATA_DIR}/sales_data.csv")
    if os.path.exists(f"{MODEL_DIR}/products_info.json"):
        with open(f"{MODEL_DIR}/products_info.json") as f:
            products_info = json.load(f)


_load()

# ─── Schemas ──────────────────────────────────────────────────────────────────

class DemandRequest(BaseModel):
    product_id: int
    days_ahead: int = 7


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Sakthi Bakers AI API", "status": "running"}


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "models_loaded": {
            "demand_predictor": demand_predictor is not None,
            "bestseller_results": bestseller_results is not None,
            "recommendation_engine": rec_engine is not None,
            "sales_data": sales_df is not None,
        },
    }


@app.get("/api/products")
def get_products():
    return [{"id": p["id"], "name": p["name"], "category": p["category"], "price": p["price"]} for p in PRODUCTS]


@app.post("/api/demand-prediction")
def predict_demand(req: DemandRequest):
    if demand_predictor is None:
        raise HTTPException(500, "Model not loaded. Run train_models.py first.")
    product = next((p for p in PRODUCTS if p["id"] == req.product_id), None)
    if not product:
        raise HTTPException(404, f"Product {req.product_id} not found")
    preds = demand_predictor.predict(
        product["id"], product["category"], product["price"],
        days_ahead=min(req.days_ahead, 30),
    )
    importance = demand_predictor.feature_importance()
    return {"product": product["name"], "category": product["category"],
            "predictions": preds, "feature_importance": importance}


@app.get("/api/bestsellers")
def get_bestsellers():
    if bestseller_results is None:
        raise HTTPException(500, "No data. Run train_models.py first.")
    return bestseller_results


@app.get("/api/production-plan")
def get_production_plan(days: int = Query(1, ge=1, le=7)):
    if demand_predictor is None:
        raise HTTPException(500, "Model not loaded.")
    planner = ProductionPlanner(demand_predictor)
    prods = [{"id": p["id"], "name": p["name"], "category": p["category"], "price": p["price"]} for p in PRODUCTS]
    plan = planner.plan(prods, days_ahead=days)
    total_prod = sum(i["recommended_production"] for i in plan)
    total_rev = sum(i["estimated_revenue"] for i in plan)
    return {
        "plan": plan,
        "summary": {
            "total_items": total_prod,
            "estimated_revenue": total_rev,
            "products_count": len(PRODUCTS),
            "days_planned": days,
        },
    }


@app.get("/api/recommendations")
def get_recommendations(product_id: int = Query(...), n: int = Query(5, ge=1, le=10)):
    if rec_engine is None:
        raise HTTPException(500, "Recommendation engine not loaded.")
    recs = rec_engine.recommend(product_id, n=n)
    product = next((p for p in PRODUCTS if p["id"] == product_id), None)
    return {"source_product": product["name"] if product else str(product_id), "recommendations": recs}


@app.get("/api/ingredient-forecast")
def get_ingredient_forecast(days: int = Query(7, ge=1, le=14)):
    if demand_predictor is None:
        raise HTTPException(500, "Model not loaded.")
    planner = ProductionPlanner(demand_predictor)
    prods = [{"id": p["id"], "name": p["name"], "category": p["category"], "price": p["price"]} for p in PRODUCTS]
    plan = planner.plan(prods, days_ahead=days)
    return IngredientForecaster().forecast(plan)


if __name__ == "__main__":
    import uvicorn
    print("\n🚀 Starting Sakthi Bakers AI API on http://localhost:8000")
    print("   Docs: http://localhost:8000/docs\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
