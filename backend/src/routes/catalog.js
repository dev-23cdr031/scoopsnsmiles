import { Router } from "express";
import {
  categories,
  giftCards,
  products,
  specialOffers,
  team,
  testimonials
} from "../data/store.js";

const router = Router();

router.get("/products", (req, res) => {
  const { category, featured, search, sort = "default", limit } = req.query;

  let items = [...products];

  if (category && category !== "all") {
    items = items.filter((item) => item.category === String(category));
  }

  if (typeof featured !== "undefined") {
    const featuredBool = String(featured).toLowerCase() === "true";
    items = items.filter((item) => item.featured === featuredBool);
  }

  if (search) {
    const searchText = String(search).toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
    );
  }

  if (sort === "price-low") {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    items.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (limit) {
    const parsedLimit = Number(limit);
    if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
      items = items.slice(0, parsedLimit);
    }
  }

  res.json(items);
});

router.get("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = products.find((product) => product.id === id);

  if (!item) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(item);
});

router.get("/categories", (_req, res) => {
  res.json(categories);
});

router.get("/testimonials", (req, res) => {
  const { limit } = req.query;
  if (!limit) {
    return res.json(testimonials);
  }

  const parsedLimit = Number(limit);
  if (Number.isNaN(parsedLimit) || parsedLimit <= 0) {
    return res.json(testimonials);
  }

  return res.json(testimonials.slice(0, parsedLimit));
});

router.get("/team", (_req, res) => {
  res.json(team);
});

router.get("/offers", (_req, res) => {
  res.json(specialOffers);
});

router.get("/gift-cards", (_req, res) => {
  res.json(giftCards);
});

export default router;
