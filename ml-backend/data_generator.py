"""
Synthetic data generator for Sakthi Bakers ML models.
Generates 365 days of realistic bakery sales data.
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os

PRODUCTS = [
    {"id": 1, "name": "Classic Sourdough", "category": "bread", "price": 249, "base_daily": 35},
    {"id": 2, "name": "Whole Wheat Loaf", "category": "bread", "price": 199, "base_daily": 28},
    {"id": 3, "name": "Multigrain Bread", "category": "bread", "price": 229, "base_daily": 20},
    {"id": 4, "name": "Butter Croissant", "category": "pastry", "price": 149, "base_daily": 45},
    {"id": 5, "name": "Chocolate Eclair", "category": "pastry", "price": 179, "base_daily": 30},
    {"id": 6, "name": "Fruit Danish", "category": "pastry", "price": 159, "base_daily": 22},
    {"id": 7, "name": "Blueberry Muffin", "category": "muffin", "price": 129, "base_daily": 40},
    {"id": 8, "name": "Chocolate Chip Muffin", "category": "muffin", "price": 129, "base_daily": 50},
    {"id": 9, "name": "Banana Nut Muffin", "category": "muffin", "price": 129, "base_daily": 25},
    {"id": 10, "name": "Red Velvet Cake", "category": "cake", "price": 1499, "base_daily": 8},
    {"id": 11, "name": "Chocolate Truffle Cake", "category": "cake", "price": 1299, "base_daily": 10},
    {"id": 12, "name": "Butterscotch Cake", "category": "cake", "price": 999, "base_daily": 7},
    {"id": 13, "name": "Black Forest Cake", "category": "cake", "price": 1199, "base_daily": 9},
    {"id": 14, "name": "Pineapple Cake", "category": "cake", "price": 899, "base_daily": 6},
    {"id": 15, "name": "Oatmeal Raisin Cookie", "category": "cookie", "price": 79, "base_daily": 55},
    {"id": 16, "name": "Chocolate Brownie", "category": "cookie", "price": 99, "base_daily": 65},
    {"id": 17, "name": "Veg Puff", "category": "puff", "price": 35, "base_daily": 120},
    {"id": 18, "name": "Chicken Puff", "category": "puff", "price": 45, "base_daily": 90},
    {"id": 19, "name": "Paneer Puff", "category": "puff", "price": 40, "base_daily": 70},
    {"id": 20, "name": "Classic Glazed Donut", "category": "donut", "price": 69, "base_daily": 60},
    {"id": 21, "name": "Chocolate Donut", "category": "donut", "price": 79, "base_daily": 50},
    {"id": 22, "name": "Strawberry Donut", "category": "donut", "price": 79, "base_daily": 40},
    {"id": 23, "name": "Gulab Jamun", "category": "sweet", "price": 25, "base_daily": 80},
    {"id": 24, "name": "Mysore Pak", "category": "sweet", "price": 30, "base_daily": 60},
]

# Weekend multipliers per category
WEEKEND_MULT = {
    "bread": 0.85, "pastry": 1.4, "muffin": 1.2, "cake": 1.8,
    "cookie": 1.1, "puff": 0.9, "donut": 1.3, "sweet": 1.5,
}

# Monthly seasonal factors
MONTHLY_SEASON = {
    1: 0.9, 2: 0.85, 3: 0.95, 4: 1.0, 5: 1.05, 6: 0.9,
    7: 0.85, 8: 0.9, 9: 1.1, 10: 1.3, 11: 1.4, 12: 1.2,
}

# Festival dates (month, day)
FESTIVALS = [
    (1, 14), (1, 15), (3, 29), (8, 15), (9, 7),
    (10, 2), (10, 12), (10, 24), (10, 25), (11, 1), (12, 25), (12, 31),
]
FESTIVAL_SET = set(FESTIVALS)


def generate_sales_data(num_days=365, start_date=None, seed=42):
    """Generate synthetic daily sales data for all 24 products."""
    np.random.seed(seed)
    if start_date is None:
        start_date = datetime(2025, 3, 10)

    records = []
    for day_offset in range(num_days):
        date = start_date + timedelta(days=day_offset)
        dow = date.weekday()
        month = date.month
        is_weekend = 1 if dow >= 5 else 0
        is_festival = 1 if (month, date.day) in FESTIVAL_SET else 0
        base_temp = 25 + 8 * np.sin((month - 4) * np.pi / 6)
        temperature = round(base_temp + np.random.normal(0, 3), 1)

        for p in PRODUCTS:
            base = p["base_daily"]
            # Weekend
            if is_weekend:
                base *= WEEKEND_MULT.get(p["category"], 1.0)
            # Season
            base *= MONTHLY_SEASON.get(month, 1.0)
            # Festival
            if is_festival:
                base *= 2.5 if p["category"] in ("sweet", "cake") else 1.5
            # Temperature
            if temperature < 20:
                base *= 1.15
            elif temperature > 35:
                base *= 0.85
            # Day-of-week micro
            if dow == 0:
                base *= 0.9
            elif dow == 4:
                base *= 1.1
            # Growth trend
            base *= 1 + (day_offset / num_days) * 0.1
            # Noise
            sales = max(0, int(base * np.random.normal(1, 0.15)))
            revenue = sales * p["price"]

            records.append({
                "date": date.strftime("%Y-%m-%d"),
                "product_id": p["id"],
                "product_name": p["name"],
                "category": p["category"],
                "price": p["price"],
                "day_of_week": dow,
                "month": month,
                "is_weekend": is_weekend,
                "is_festival": is_festival,
                "temperature": temperature,
                "quantity_sold": sales,
                "revenue": revenue,
            })

    return pd.DataFrame(records)


def save_data(df, path="data"):
    os.makedirs(path, exist_ok=True)
    fp = os.path.join(path, "sales_data.csv")
    df.to_csv(fp, index=False)
    print(f"Saved {len(df):,} records to {fp}")
    return fp


if __name__ == "__main__":
    df = generate_sales_data()
    save_data(df)
    print(f"\nShape: {df.shape}")
    print(f"Date range: {df['date'].min()} → {df['date'].max()}")
    print(f"Products: {df['product_id'].nunique()}")
    print(f"\nSample:\n{df.head(10)}")
