import { Router } from "express";
import pool from "../db/connection.js";

const router = Router();

router.get("/products", async (req, res) => {
  const { category, featured, search, sort = "default", limit } = req.query;

  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (category && category !== "all") {
    sql += " AND category = ?";
    params.push(String(category));
  }

  if (typeof featured !== "undefined") {
    sql += " AND featured = ?";
    params.push(String(featured).toLowerCase() === "true" ? 1 : 0);
  }

  if (search) {
    sql += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ?)";
    const searchText = `%${String(search).toLowerCase()}%`;
    params.push(searchText, searchText);
  }

  if (sort === "price-low") sql += " ORDER BY price ASC";
  else if (sort === "price-high") sql += " ORDER BY price DESC";
  else if (sort === "name") sql += " ORDER BY name ASC";

  const parsedLimit = Number(limit);
  if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
    sql += " LIMIT ?";
    params.push(parsedLimit);
  }

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows.map((r) => ({ ...r, featured: r.featured === 1 })));
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const item = rows[0];
    return res.json({ ...item, featured: item.featured === 1 });
  } catch (err) {
    return res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.get("/categories", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.get("/testimonials", async (req, res) => {
  try {
    const parsedLimit = Number(req.query.limit);
    let sql = "SELECT * FROM testimonials";
    const params = [];
    if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
      sql += " LIMIT ?";
      params.push(parsedLimit);
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.get("/team", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM team");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.get("/offers", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM special_offers");
    res.json(rows.map((r) => ({ ...r, validTill: r.valid_till })));
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

router.get("/gift-cards", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM gift_cards");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

export default router;
