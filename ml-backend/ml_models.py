"""
Machine Learning models for Sakthi Bakers AI Dashboard.

Models:
  1. DemandPredictor      – RandomForest regressor for daily demand
  2. BestsellerAnalyzer   – Statistical ranking & trend analysis
  3. ProductionPlanner    – Demand-based production optimization
  4. RecommendationEngine – Content-based + popularity hybrid
  5. IngredientForecaster – Recipe mapping × demand forecast
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.neighbors import NearestNeighbors
from datetime import datetime, timedelta


# ─── 1. Demand Prediction ────────────────────────────────────────────────────

class DemandPredictor:
    """Predicts daily demand for each product using Random Forest."""

    FEATURES = [
        "product_id", "category_encoded", "day_of_week",
        "month", "is_weekend", "is_festival", "temperature", "price",
    ]

    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=150, max_depth=14, min_samples_leaf=4,
            random_state=42, n_jobs=-1,
        )
        self.le = LabelEncoder()
        self.trained = False

    def _features(self, df, fit_le=False):
        X = df[["product_id", "day_of_week", "month",
                "is_weekend", "is_festival", "temperature", "price"]].copy()
        if fit_le:
            X["category_encoded"] = self.le.fit_transform(df["category"])
        else:
            X["category_encoded"] = self.le.transform(df["category"])
        return X[self.FEATURES]

    def train(self, df):
        X = self._features(df, fit_le=True)
        y = df["quantity_sold"]
        Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)
        self.model.fit(Xtr, ytr)
        self.trained = True
        preds = self.model.predict(Xte)
        return {
            "mae": round(mean_absolute_error(yte, preds), 2),
            "r2": round(r2_score(yte, preds), 4),
        }

    def predict(self, product_id, category, price, days_ahead=7, base_temp=28):
        assert self.trained, "Train the model first"
        results = []
        today = datetime.now()
        for i in range(1, days_ahead + 1):
            d = today + timedelta(days=i)
            row = pd.DataFrame([{
                "product_id": product_id,
                "category_encoded": self.le.transform([category])[0],
                "day_of_week": d.weekday(),
                "month": d.month,
                "is_weekend": 1 if d.weekday() >= 5 else 0,
                "is_festival": 0,
                "temperature": base_temp + np.random.normal(0, 2),
                "price": price,
            }])[self.FEATURES]
            pred = self.model.predict(row)[0]
            std = pred * 0.15
            results.append({
                "date": d.strftime("%Y-%m-%d"),
                "day": d.strftime("%a"),
                "predicted_quantity": max(0, int(round(pred))),
                "confidence_low": max(0, int(round(pred - 1.96 * std))),
                "confidence_high": int(round(pred + 1.96 * std)),
            })
        return results

    def feature_importance(self):
        if not self.trained:
            return {}
        imp = self.model.feature_importances_
        return {f: round(float(v), 4) for f, v in zip(self.FEATURES, imp)}


# ─── 2. Bestseller Analysis ──────────────────────────────────────────────────

class BestsellerAnalyzer:
    """Rankings, trends, and category breakdown."""

    def analyze(self, df):
        ps = (
            df.groupby(["product_id", "product_name", "category"])
            .agg(
                total_sold=("quantity_sold", "sum"),
                total_revenue=("revenue", "sum"),
                avg_daily=("quantity_sold", "mean"),
                max_daily=("quantity_sold", "max"),
            )
            .reset_index()
            .sort_values("total_sold", ascending=False)
        )
        ps["rank"] = range(1, len(ps) + 1)

        # Trend: last 30 d vs previous 30 d
        dates = pd.to_datetime(df["date"])
        mx = dates.max()
        recent = df[dates > mx - timedelta(days=30)]
        prev   = df[(dates > mx - timedelta(days=60)) & (dates <= mx - timedelta(days=30))]
        r_avg = recent.groupby("product_id")["quantity_sold"].mean()
        p_avg = prev.groupby("product_id")["quantity_sold"].mean()
        growth = ((r_avg - p_avg) / p_avg * 100).round(1)

        ps["growth_pct"] = ps["product_id"].map(growth).fillna(0).round(1)
        ps["trend"] = ps["growth_pct"].apply(
            lambda x: "rising" if x > 5 else ("falling" if x < -5 else "stable")
        )

        # Numeric conversions
        for col in ["total_sold", "total_revenue", "max_daily"]:
            ps[col] = ps[col].astype(int)
        ps["avg_daily"] = ps["avg_daily"].round(1)

        cat = (
            df.groupby("category")
            .agg(total_sold=("quantity_sold", "sum"), total_revenue=("revenue", "sum"))
            .reset_index()
            .sort_values("total_revenue", ascending=False)
        )
        cat["total_sold"] = cat["total_sold"].astype(int)
        cat["total_revenue"] = cat["total_revenue"].astype(int)

        return {
            "rankings": ps.to_dict("records"),
            "category_breakdown": cat.to_dict("records"),
            "total_products": len(ps),
            "total_sales": int(ps["total_sold"].sum()),
            "total_revenue": int(ps["total_revenue"].sum()),
        }


# ─── 3. Production Planner ───────────────────────────────────────────────────

class ProductionPlanner:
    WASTE_FACTOR = 0.05
    SAFETY_FACTOR = 0.20

    def __init__(self, demand_predictor):
        self.dp = demand_predictor

    def plan(self, products, days_ahead=1):
        rows = []
        for p in products:
            preds = self.dp.predict(p["id"], p["category"], p["price"], days_ahead)
            for pr in preds:
                d = pr["predicted_quantity"]
                ss = int(d * self.SAFETY_FACTOR)
                wa = int(d * self.WASTE_FACTOR)
                rec = d + ss + wa
                rows.append({
                    "product_id": p["id"],
                    "product_name": p["name"],
                    "category": p["category"],
                    "date": pr["date"],
                    "predicted_demand": d,
                    "safety_stock": ss,
                    "waste_allowance": wa,
                    "recommended_production": rec,
                    "estimated_revenue": rec * p["price"],
                })
        return rows


# ─── 4. Recommendation Engine ────────────────────────────────────────────────

class RecommendationEngine:
    def __init__(self):
        self.products_df = None
        self.feat_matrix = None
        self.nn = None

    def fit(self, sales_df, products):
        self.products_df = pd.DataFrame(products)
        cats = pd.get_dummies(self.products_df["category"], prefix="cat")

        pop = sales_df.groupby("product_id")["quantity_sold"].mean().reset_index()
        pop.columns = ["id", "avg_sales"]
        self.products_df = self.products_df.merge(pop, on="id", how="left")
        self.products_df["avg_sales"] = self.products_df["avg_sales"].fillna(0)

        mx_price = self.products_df["price"].max() or 1
        mx_sales = self.products_df["avg_sales"].max() or 1

        feats = pd.concat([
            cats,
            (self.products_df["price"] / mx_price).rename("price_norm"),
            (self.products_df["avg_sales"] / mx_sales).rename("popularity"),
        ], axis=1)

        self.feat_matrix = feats.values
        self.nn = NearestNeighbors(n_neighbors=min(8, len(products)), metric="cosine")
        self.nn.fit(self.feat_matrix)

    def recommend(self, product_id, n=5):
        idx_arr = self.products_df[self.products_df["id"] == product_id].index
        if len(idx_arr) == 0:
            return []
        idx = idx_arr[0]
        dists, idxs = self.nn.kneighbors(self.feat_matrix[idx].reshape(1, -1), n_neighbors=n + 1)
        recs = []
        src_cat = self.products_df.iloc[idx]["category"]
        for dist, ri in zip(dists[0], idxs[0]):
            if ri == idx:
                continue
            p = self.products_df.iloc[ri]
            score = round((1 - dist) * 100, 1)
            if p["category"] == src_cat:
                reason = f"Same category ({p['category']})"
            elif abs(p["price"] - self.products_df.iloc[idx]["price"]) < 100:
                reason = "Similar price range"
            else:
                reason = "Popular with similar customers"
            recs.append({
                "product_id": int(p["id"]),
                "product_name": p["name"],
                "category": p["category"],
                "price": int(p["price"]),
                "match_score": score,
                "reason": reason,
            })
        return recs[:n]

    def trending(self, df, n=5):
        dates = pd.to_datetime(df["date"])
        mx = dates.max()
        recent = df[dates > mx - timedelta(days=14)]
        prev = df[(dates > mx - timedelta(days=28)) & (dates <= mx - timedelta(days=14))]
        r_avg = recent.groupby(["product_id", "product_name"])["quantity_sold"].mean()
        p_avg = prev.groupby(["product_id", "product_name"])["quantity_sold"].mean()
        growth = ((r_avg - p_avg) / p_avg * 100).round(1)
        top = growth.sort_values(ascending=False).head(n)
        results = []
        for (pid, pname), g in top.items():
            results.append({"product_id": int(pid), "product_name": pname, "growth_pct": float(g)})
        return results


# ─── 5. Ingredient Forecaster ────────────────────────────────────────────────

class IngredientForecaster:
    """Maps product categories → ingredient quantities, then multiplies by demand."""

    # grams per unit produced
    RECIPES = {
        "bread":  {"flour": 400, "yeast": 8, "salt": 8, "water": 250, "butter": 20, "sugar": 10},
        "pastry": {"flour": 200, "butter": 150, "sugar": 50, "eggs": 60, "cream": 50, "vanilla": 2},
        "muffin": {"flour": 150, "sugar": 80, "eggs": 50, "butter": 60, "milk": 80, "baking_powder": 5},
        "cake":   {"flour": 300, "sugar": 250, "eggs": 200, "butter": 200, "milk": 150, "vanilla": 5, "cream": 200, "baking_powder": 8},
        "cookie": {"flour": 100, "sugar": 60, "butter": 80, "eggs": 30, "chocolate": 40, "vanilla": 2},
        "puff":   {"flour": 120, "oil": 40, "salt": 3, "potatoes": 80, "spices": 5},
        "donut":  {"flour": 180, "sugar": 60, "yeast": 5, "eggs": 40, "oil": 100, "milk": 60, "vanilla": 2},
        "sweet":  {"sugar": 150, "milk": 200, "ghee": 100, "flour": 50, "cardamom": 2},
    }

    def forecast(self, production_plan):
        totals = {}
        daily = {}
        for item in production_plan:
            recipe = self.RECIPES.get(item["category"], {})
            qty = item["recommended_production"]
            date = item["date"]
            if date not in daily:
                daily[date] = {}
            for ing, g in recipe.items():
                totals[ing] = totals.get(ing, 0) + qty * g
                daily[date][ing] = daily[date].get(ing, 0) + qty * g

        ingredients = sorted(
            [{"name": n, "total_grams": int(g), "total_kg": round(g / 1000, 2)} for n, g in totals.items()],
            key=lambda x: -x["total_grams"],
        )
        daily_list = []
        for d in sorted(daily):
            row = {"date": d}
            for ing, g in daily[d].items():
                row[ing] = round(g / 1000, 2)
            daily_list.append(row)

        return {
            "total_ingredients": ingredients,
            "daily_breakdown": daily_list,
            "forecast_days": len(daily_list),
        }
