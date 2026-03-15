"""
Train all ML models for Sakthi Bakers AI Dashboard.
Run:  python train_models.py
"""

import os, json, joblib
from data_generator import generate_sales_data, PRODUCTS, save_data
from ml_models import (
    DemandPredictor, BestsellerAnalyzer,
    RecommendationEngine,
)

MODEL_DIR = "saved_models"


def train_all():
    print("=" * 60)
    print("  Sakthi Bakers — ML Training Pipeline")
    print("=" * 60)

    # ── 1. Generate data ─────────────────────────────────────────
    print("\n[1/5] Generating synthetic sales data …")
    df = generate_sales_data(num_days=365)
    save_data(df)
    print(f"  {len(df):,} records · {df['product_id'].nunique()} products")

    # ── 2. Demand Predictor ──────────────────────────────────────
    print("\n[2/5] Training Demand Prediction model …")
    dp = DemandPredictor()
    metrics = dp.train(df)
    print(f"  MAE: {metrics['mae']}  R²: {metrics['r2']}")
    fi = dp.feature_importance()
    print(f"  Top features: {sorted(fi.items(), key=lambda x: -x[1])[:3]}")

    # ── 3. Bestseller Analysis ───────────────────────────────────
    print("\n[3/5] Running Bestseller Analysis …")
    ba = BestsellerAnalyzer()
    bs = ba.analyze(df)
    print(f"  Total sales: {bs['total_sales']:,}")
    print(f"  Total revenue: ₹{bs['total_revenue']:,}")
    for item in bs["rankings"][:3]:
        print(f"  #{item['rank']} {item['product_name']}: {item['total_sold']:,} units ({item['trend']})")

    # ── 4. Recommendation Engine ─────────────────────────────────
    print("\n[4/5] Training Recommendation Engine …")
    products_info = [
        {"id": p["id"], "name": p["name"], "category": p["category"], "price": p["price"]}
        for p in PRODUCTS
    ]
    rec = RecommendationEngine()
    rec.fit(df, products_info)
    test_recs = rec.recommend(1, n=3)
    print(f"  Recs for 'Classic Sourdough': {[r['product_name'] for r in test_recs]}")

    # ── 5. Save ──────────────────────────────────────────────────
    print("\n[5/5] Saving models …")
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(dp, f"{MODEL_DIR}/demand_predictor.pkl")
    joblib.dump(ba, f"{MODEL_DIR}/bestseller_analyzer.pkl")
    joblib.dump(rec, f"{MODEL_DIR}/recommendation_engine.pkl")
    with open(f"{MODEL_DIR}/products_info.json", "w") as f:
        json.dump(products_info, f)
    with open(f"{MODEL_DIR}/bestseller_results.json", "w") as f:
        json.dump(bs, f, default=str)

    print("  ✓ All models saved to saved_models/")
    print("\n" + "=" * 60)
    print("  Done! Start the API server with:  python main.py")
    print("=" * 60)


if __name__ == "__main__":
    train_all()
