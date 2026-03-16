import fs from "node:fs";
import path from "node:path";
import { products } from "../data/store.js";

const DEFAULT_KAGGLE_CSV_PATH = path.resolve(process.cwd(), "data", "kaggle_bakery_sales.csv");

const FESTIVAL_DATES = new Set([
  "01-14",
  "01-15",
  "08-15",
  "10-24",
  "10-25",
  "11-01",
  "12-25",
  "12-31"
]);

const CATEGORY_BASE_DEMAND = {
  breads: 28,
  pastries: 34,
  muffins: 24,
  cakes: 8,
  cookies: 22,
  puffs: 44,
  donuts: 30,
  sweets: 26
};

const WEEKEND_MULTIPLIER = {
  breads: 0.9,
  pastries: 1.28,
  muffins: 1.14,
  cakes: 1.32,
  cookies: 1.08,
  puffs: 0.95,
  donuts: 1.21,
  sweets: 1.26
};

const MONTH_MULTIPLIER = {
  1: 0.94,
  2: 0.91,
  3: 0.96,
  4: 1.0,
  5: 1.03,
  6: 0.92,
  7: 0.89,
  8: 0.94,
  9: 1.06,
  10: 1.2,
  11: 1.25,
  12: 1.15
};

const CATEGORY_PRICE_FALLBACK = {
  breads: 520,
  pastries: 430,
  muffins: 340,
  cakes: 2400,
  cookies: 720,
  puffs: 62,
  donuts: 130,
  sweets: 280
};

const FEATURE_KEYS = [
  "trendIndex",
  "isWeekend",
  "isFestival",
  "sinDow",
  "cosDow",
  "featured",
  "priceScaled"
];

const DATE_CANDIDATES = ["date", "orderdate", "transactiondate", "datetime", "timestamp", "createdat"];
const PRODUCT_CANDIDATES = ["product", "productname", "item", "article", "name", "menuitem"];
const QUANTITY_CANDIDATES = ["quantity", "qty", "units", "count", "items"];
const PRICE_CANDIDATES = ["price", "unitprice", "sellingprice", "mrp", "itemprice"];
const REVENUE_CANDIDATES = ["revenue", "sales", "amount", "total", "totalamount", "lineamount"];
const CATEGORY_CANDIDATES = ["category", "productcategory", "group", "segment"];

let modelContext;

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dayKey(date) {
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isFestivalDate(date) {
  return FESTIVAL_DATES.has(dayKey(date));
}

function normalizePrice(record) {
  return Math.min(1, (Number(record.price) || 0) / 3000);
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1);
}

function normalizeHeader(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function parseNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : Number.NaN;
  }

  const cleaned = String(value || "")
    .replace(/[^0-9.\-]/g, "")
    .trim();

  if (!cleaned) {
    return Number.NaN;
  }

  return Number(cleaned);
}

function normalizeCategory(rawValue) {
  const value = normalizeText(rawValue);
  if (!value) {
    return null;
  }

  const mappings = [
    { keys: ["bread", "breads", "loaf", "sourdough", "rye"], category: "breads" },
    { keys: ["pastry", "pastries", "croissant", "danish", "eclair", "tart"], category: "pastries" },
    { keys: ["muffin", "muffins"], category: "muffins" },
    { keys: ["cake", "cakes", "gateau"], category: "cakes" },
    { keys: ["cookie", "cookies", "biscuit", "biscotti"], category: "cookies" },
    { keys: ["puff", "puffs"], category: "puffs" },
    { keys: ["donut", "donuts", "doughnut", "doughnuts"], category: "donuts" },
    { keys: ["sweet", "sweets", "dessert", "mithai"], category: "sweets" }
  ];

  for (const mapping of mappings) {
    if (mapping.keys.some((keyword) => value.includes(keyword))) {
      return mapping.category;
    }
  }

  return null;
}

function inferCategoryFromName(name) {
  return normalizeCategory(name) || "pastries";
}

function parseCsvRows(content) {
  const rows = [];
  let currentRow = [];
  let currentValue = "";
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];

    if (char === '"') {
      if (inQuotes && content[index + 1] === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && content[index + 1] === "\n") {
        index += 1;
      }

      currentRow.push(currentValue);
      currentValue = "";

      if (currentRow.some((value) => String(value).trim().length > 0)) {
        rows.push(currentRow);
      }

      currentRow = [];
      continue;
    }

    currentValue += char;
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue);
    if (currentRow.some((value) => String(value).trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length > 0 && rows[0].length > 0) {
    rows[0][0] = String(rows[0][0]).replace(/^\ufeff/, "");
  }

  return rows;
}

function resolveDatasetCsvPath() {
  const configured = process.env.ADMIN_KAGGLE_DATASET_CSV;
  if (!configured) {
    return DEFAULT_KAGGLE_CSV_PATH;
  }

  if (path.isAbsolute(configured)) {
    return configured;
  }

  return path.resolve(process.cwd(), configured);
}

function pickColumnIndex(headers, candidates) {
  const normalizedHeaders = headers.map((header) => normalizeHeader(header));

  for (const candidate of candidates) {
    const exactIndex = normalizedHeaders.findIndex((header) => header === candidate);
    if (exactIndex >= 0) {
      return exactIndex;
    }
  }

  for (const candidate of candidates) {
    const partialIndex = normalizedHeaders.findIndex((header) => header.includes(candidate));
    if (partialIndex >= 0) {
      return partialIndex;
    }
  }

  return -1;
}

function parseDateParts(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return null;
  }

  const isoMatch = raw.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
  if (isoMatch) {
    return {
      year: Number(isoMatch[1]),
      month: Number(isoMatch[2]),
      day: Number(isoMatch[3])
    };
  }

  const dmyMatch = raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/);
  if (dmyMatch) {
    const year = dmyMatch[3].length === 2 ? Number(`20${dmyMatch[3]}`) : Number(dmyMatch[3]);
    return {
      year,
      month: Number(dmyMatch[2]),
      day: Number(dmyMatch[1])
    };
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return {
    year: parsed.getFullYear(),
    month: parsed.getMonth() + 1,
    day: parsed.getDate()
  };
}

function buildCatalogMatcher() {
  return products.map((product) => ({
    product,
    normalizedName: normalizeText(product.name),
    tokens: new Set(tokenize(product.name))
  }));
}

function computeTokenScore(aTokens, bTokens) {
  let overlap = 0;
  aTokens.forEach((token) => {
    if (bTokens.has(token)) {
      overlap += 1;
    }
  });

  const denom = Math.max(1, Math.max(aTokens.size, bTokens.size));
  return overlap / denom;
}

function matchCatalogProduct(rawName, matcherRows) {
  const normalizedName = normalizeText(rawName);
  if (!normalizedName) {
    return null;
  }

  const sourceTokens = new Set(tokenize(normalizedName));
  let bestMatch = null;
  let bestScore = 0;

  for (const row of matcherRows) {
    if (row.normalizedName === normalizedName) {
      return row.product;
    }

    let score = computeTokenScore(sourceTokens, row.tokens);
    if (row.normalizedName.includes(normalizedName) || normalizedName.includes(row.normalizedName)) {
      score = Math.max(score, 0.8);
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = row.product;
    }
  }

  return bestScore >= 0.45 ? bestMatch : null;
}

function buildKaggleDataset() {
  const csvPath = resolveDatasetCsvPath();
  if (!fs.existsSync(csvPath)) {
    return null;
  }

  const csvContent = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsvRows(csvContent);
  if (rows.length < 2) {
    return null;
  }

  const headers = rows[0];
  const dateIndex = pickColumnIndex(headers, DATE_CANDIDATES);
  const productIndex = pickColumnIndex(headers, PRODUCT_CANDIDATES);
  const quantityIndex = pickColumnIndex(headers, QUANTITY_CANDIDATES);
  const priceIndex = pickColumnIndex(headers, PRICE_CANDIDATES);
  const revenueIndex = pickColumnIndex(headers, REVENUE_CANDIDATES);
  const categoryIndex = pickColumnIndex(headers, CATEGORY_CANDIDATES);

  if (dateIndex < 0 || productIndex < 0) {
    return null;
  }

  const catalogMatcher = buildCatalogMatcher();
  const externalIds = new Map();
  const aggregates = new Map();

  const matchedCatalogProducts = new Set();
  const externalProducts = new Set();

  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index];

    const dateParts = parseDateParts(row[dateIndex]);
    if (!dateParts) {
      continue;
    }

    const dateObj = new Date(dateParts.year, dateParts.month - 1, dateParts.day);
    if (Number.isNaN(dateObj.getTime())) {
      continue;
    }

    const isoDate = `${String(dateParts.year).padStart(4, "0")}-${String(dateParts.month).padStart(2, "0")}-${String(dateParts.day).padStart(2, "0")}`;

    const rawName = String(row[productIndex] || "").trim();
    if (!rawName) {
      continue;
    }

    const matchedCatalog = matchCatalogProduct(rawName, catalogMatcher);
    if (matchedCatalog) {
      matchedCatalogProducts.add(matchedCatalog.id);
    }

    const normalizedName = normalizeText(rawName);
    if (!matchedCatalog && !externalIds.has(normalizedName)) {
      externalIds.set(normalizedName, 10000 + externalIds.size + 1);
    }

    const inferredCategory = normalizeCategory(categoryIndex >= 0 ? row[categoryIndex] : "") || inferCategoryFromName(rawName);

    const productId = matchedCatalog ? matchedCatalog.id : externalIds.get(normalizedName);
    const productName = matchedCatalog ? matchedCatalog.name : rawName;
    const category = matchedCatalog?.category || inferredCategory;
    const featured = matchedCatalog?.featured ? 1 : 0;

    const parsedQuantity = quantityIndex >= 0 ? parseNumber(row[quantityIndex]) : Number.NaN;
    const quantity = Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 1;

    const parsedPrice = priceIndex >= 0 ? parseNumber(row[priceIndex]) : Number.NaN;
    const parsedRevenue = revenueIndex >= 0 ? parseNumber(row[revenueIndex]) : Number.NaN;

    const estimatedPriceFromRevenue = Number.isFinite(parsedRevenue) && quantity > 0 ? parsedRevenue / quantity : Number.NaN;
    const price = Number.isFinite(parsedPrice) && parsedPrice > 0
      ? parsedPrice
      : Number.isFinite(estimatedPriceFromRevenue) && estimatedPriceFromRevenue > 0
        ? estimatedPriceFromRevenue
        : matchedCatalog?.price || CATEGORY_PRICE_FALLBACK[category] || 250;

    const revenue = Number.isFinite(parsedRevenue) && parsedRevenue > 0 ? parsedRevenue : quantity * price;

    const key = `${isoDate}__${productId}`;
    if (!aggregates.has(key)) {
      aggregates.set(key, {
        date: isoDate,
        productId,
        productName,
        category,
        price,
        featured,
        quantity: 0,
        revenue: 0
      });
    }

    const bucket = aggregates.get(key);
    bucket.quantity += quantity;
    bucket.revenue += revenue;

    if (!matchedCatalog) {
      externalProducts.add(productId);
    }
  }

  const compacted = [...aggregates.values()].sort((a, b) => {
    if (a.date === b.date) {
      return a.productId - b.productId;
    }
    return a.date.localeCompare(b.date);
  });

  if (compacted.length < 30) {
    return null;
  }

  const dates = [...new Set(compacted.map((item) => item.date))].sort();
  const dateIndexMap = new Map(dates.map((date, index) => [date, index]));
  const maxTrend = Math.max(1, dates.length - 1);

  const records = compacted.map((item) => {
    const dateParts = parseDateParts(item.date);
    const dateObj = new Date(dateParts.year, dateParts.month - 1, dateParts.day);
    const trendIndex = dateIndexMap.get(item.date) / maxTrend;

    return {
      date: item.date,
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      price: Number(item.price),
      featured: item.featured,
      dayOfWeek: dateObj.getDay(),
      month: dateObj.getMonth() + 1,
      isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6 ? 1 : 0,
      isFestival: isFestivalDate(dateObj) ? 1 : 0,
      trendIndex,
      quantity: Math.max(1, Math.round(item.quantity)),
      revenue: Math.round(item.revenue)
    };
  });

  return {
    records,
    startDate: records[0]?.date || null,
    endDate: records[records.length - 1]?.date || null,
    source: "Kaggle dataset",
    mode: "kaggle-csv",
    filePath: path.relative(process.cwd(), csvPath).replace(/\\/g, "/"),
    catalogCoverage: {
      matchedCatalogProducts: matchedCatalogProducts.size,
      externalProducts: externalProducts.size
    }
  };
}

function buildSyntheticDataset(days = 240) {
  const random = createSeededRandom(20260316);
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  const records = [];

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - (days - 1 - offset));

    const dayOfWeek = date.getDay();
    const month = date.getMonth() + 1;
    const weekend = dayOfWeek === 0 || dayOfWeek === 6;
    const festival = isFestivalDate(date);

    products.forEach((product) => {
      const base = CATEGORY_BASE_DEMAND[product.category] || 20;
      const weekendFactor = weekend ? WEEKEND_MULTIPLIER[product.category] || 1 : 1;
      const monthFactor = MONTH_MULTIPLIER[month] || 1;
      const featuredFactor = product.featured ? 1.08 : 1;
      const badgeFactor = product.badge ? 1.05 : 1;
      const festivalFactor = festival
        ? product.category === "cakes" || product.category === "sweets"
          ? 1.8
          : 1.25
        : 1;

      const demandGrowth = 1 + (offset / days) * 0.08;
      const pricePenalty = 1.1 - normalizePrice(product) * 0.35;
      const noise = 0.88 + random() * 0.28;

      const quantity = Math.max(
        1,
        Math.round(
          base * weekendFactor * monthFactor * featuredFactor * badgeFactor * festivalFactor * demandGrowth * pricePenalty * noise
        )
      );

      records.push({
        date: toIsoDate(date),
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
        featured: product.featured ? 1 : 0,
        dayOfWeek,
        month,
        isWeekend: weekend ? 1 : 0,
        isFestival: festival ? 1 : 0,
        trendIndex: offset / days,
        quantity,
        revenue: quantity * product.price
      });
    });
  }

  return {
    records,
    startDate: records[0]?.date || null,
    endDate: records[records.length - 1]?.date || null,
    source: "Synthetic fallback dataset",
    mode: "synthetic-fallback",
    filePath: null,
    catalogCoverage: {
      matchedCatalogProducts: products.length,
      externalProducts: 0
    }
  };
}

function buildHistoricalDataset() {
  const kaggleDataset = buildKaggleDataset();
  if (kaggleDataset) {
    return kaggleDataset;
  }

  return buildSyntheticDataset();
}

function buildCategoryMap(records) {
  const categories = [...new Set(records.map((record) => record.category))].sort();
  return { categories };
}

function encodeFeatures(record, categoryMap) {
  const sinDow = Math.sin((2 * Math.PI * record.dayOfWeek) / 7);
  const cosDow = Math.cos((2 * Math.PI * record.dayOfWeek) / 7);
  const categoryOneHot = categoryMap.categories.map((category) => (category === record.category ? 1 : 0));
  const base = [
    record.trendIndex,
    record.isWeekend,
    record.isFestival,
    sinDow,
    cosDow,
    record.featured,
    normalizePrice(record)
  ];
  return [...base, ...categoryOneHot];
}

function fitStandardScaler(matrix) {
  const columns = matrix[0]?.length || 0;
  const means = new Array(columns).fill(0);
  const stds = new Array(columns).fill(1);

  for (let column = 0; column < columns; column += 1) {
    const values = matrix.map((row) => row[column]);
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
    const std = Math.sqrt(variance);

    means[column] = mean;
    stds[column] = std > 0 ? std : 1;
  }

  return { means, stds };
}

function applyStandardScaler(matrix, scaler) {
  return matrix.map((row) => row.map((value, index) => (value - scaler.means[index]) / scaler.stds[index]));
}

function trainLinearRegression(samples, labels, options = {}) {
  const learningRate = options.learningRate || 0.03;
  const epochs = options.epochs || 1400;

  const featureCount = samples[0]?.length || 0;
  const weights = new Array(featureCount + 1).fill(0);
  const itemCount = samples.length || 1;

  for (let epoch = 0; epoch < epochs; epoch += 1) {
    const gradients = new Array(featureCount + 1).fill(0);

    for (let rowIndex = 0; rowIndex < itemCount; rowIndex += 1) {
      const row = samples[rowIndex];
      let prediction = weights[0];

      for (let col = 0; col < featureCount; col += 1) {
        prediction += weights[col + 1] * row[col];
      }

      const error = prediction - labels[rowIndex];
      gradients[0] += error;

      for (let col = 0; col < featureCount; col += 1) {
        gradients[col + 1] += error * row[col];
      }
    }

    for (let i = 0; i < weights.length; i += 1) {
      weights[i] -= (learningRate * gradients[i]) / itemCount;
    }
  }

  return weights;
}

function predict(weights, features) {
  let value = weights[0];
  for (let i = 0; i < features.length; i += 1) {
    value += weights[i + 1] * features[i];
  }
  return value;
}

function evaluateRegression(weights, features, labels) {
  let absoluteError = 0;
  let sumSquaredError = 0;

  const labelMean = labels.reduce((sum, value) => sum + value, 0) / labels.length;
  let totalVariance = 0;

  for (let i = 0; i < features.length; i += 1) {
    const prediction = predict(weights, features[i]);
    const error = labels[i] - prediction;
    absoluteError += Math.abs(error);
    sumSquaredError += error * error;

    const variance = labels[i] - labelMean;
    totalVariance += variance * variance;
  }

  return {
    mae: absoluteError / labels.length,
    rmse: Math.sqrt(sumSquaredError / labels.length),
    r2: totalVariance === 0 ? 0 : 1 - sumSquaredError / totalVariance
  };
}

function calculateBestSellers(records) {
  const byProduct = new Map();

  records.forEach((record) => {
    if (!byProduct.has(record.productId)) {
      byProduct.set(record.productId, {
        productId: record.productId,
        productName: record.productName,
        category: record.category,
        totalUnits: 0,
        totalRevenue: 0,
        dayCount: 0,
        last30DaysUnits: 0,
        previous30DaysUnits: 0
      });
    }

    const item = byProduct.get(record.productId);
    item.totalUnits += record.quantity;
    item.totalRevenue += record.revenue;
    item.dayCount += 1;
  });

  const dates = [...new Set(records.map((record) => record.date))].sort();
  const recentDates = new Set(dates.slice(-30));
  const previousDates = new Set(dates.slice(-60, -30));

  records.forEach((record) => {
    const item = byProduct.get(record.productId);
    if (recentDates.has(record.date)) {
      item.last30DaysUnits += record.quantity;
    }
    if (previousDates.has(record.date)) {
      item.previous30DaysUnits += record.quantity;
    }
  });

  return [...byProduct.values()]
    .map((item) => {
      const growth =
        item.previous30DaysUnits > 0
          ? ((item.last30DaysUnits - item.previous30DaysUnits) / item.previous30DaysUnits) * 100
          : 0;

      return {
        productId: item.productId,
        productName: item.productName,
        category: item.category,
        totalUnits: item.totalUnits,
        totalRevenue: Math.round(item.totalRevenue),
        avgDailyUnits: Number((item.totalUnits / item.dayCount).toFixed(1)),
        last30DaysUnits: item.last30DaysUnits,
        growthPercent: Number(growth.toFixed(1)),
        trend: growth > 5 ? "rising" : growth < -5 ? "falling" : "stable"
      };
    })
    .sort((a, b) => b.totalUnits - a.totalUnits)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function buildModelContext() {
  const dataset = buildHistoricalDataset();
  const categoryMap = buildCategoryMap(dataset.records);
  const features = dataset.records.map((record) => encodeFeatures(record, categoryMap));
  const labels = dataset.records.map((record) => record.quantity);

  const scaler = fitStandardScaler(features);
  const scaled = applyStandardScaler(features, scaler);
  const weights = trainLinearRegression(scaled, labels);
  const metrics = evaluateRegression(weights, scaled, labels);
  const bestSellers = calculateBestSellers(dataset.records);

  return {
    dataset,
    categoryMap,
    scaler,
    weights,
    metrics,
    bestSellers,
    generatedAt: new Date().toISOString()
  };
}

function getOrCreateContext({ refresh = false } = {}) {
  if (!modelContext || refresh) {
    modelContext = buildModelContext();
  }
  return modelContext;
}

function buildFutureForecast(context, options = {}) {
  const days = Math.max(1, Math.min(30, Number(options.days || 7)));
  const productLimit = Math.max(1, Math.min(12, Number(options.limit || 8)));

  const topProducts = context.bestSellers.slice(0, productLimit);
  const totalsByDate = new Map();

  const forecasts = topProducts.map((product) => {
    const source = products.find((item) => item.id === product.productId);
    const nextDays = [];

    for (let index = 1; index <= days; index += 1) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + index);

      const dayOfWeek = date.getDay();
      const row = {
        trendIndex: 1 + index / 365,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0,
        isFestival: isFestivalDate(date) ? 1 : 0,
        dayOfWeek,
        featured: source?.featured ? 1 : 0,
        price: source?.price || product.totalRevenue / Math.max(1, product.totalUnits),
        category: source?.category || product.category
      };

      const encoded = encodeFeatures(row, context.categoryMap);
      const scaled = applyStandardScaler([encoded], context.scaler)[0];
      const predictedUnits = Math.max(1, Math.round(predict(context.weights, scaled)));
      const isoDate = toIsoDate(date);

      nextDays.push({ date: isoDate, predictedUnits });
      totalsByDate.set(isoDate, (totalsByDate.get(isoDate) || 0) + predictedUnits);
    }

    const predictedPeriodTotal = nextDays.reduce((sum, item) => sum + item.predictedUnits, 0);
    const avgDailyPrediction = predictedPeriodTotal / nextDays.length;

    return {
      productId: product.productId,
      productName: product.productName,
      category: product.category,
      rank: product.rank,
      avgDailyPrediction: Number(avgDailyPrediction.toFixed(1)),
      predictedPeriodTotal,
      demandConfidenceBand: {
        low: Math.max(0, Math.round(predictedPeriodTotal - context.metrics.mae * Math.sqrt(days))),
        high: Math.round(predictedPeriodTotal + context.metrics.mae * Math.sqrt(days))
      },
      nextDays
    };
  });

  const overallForecast = [...totalsByDate.entries()]
    .map(([date, predictedUnits]) => ({ date, predictedUnits }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    forecasts,
    overallForecast,
    topDemandProducts: [...forecasts]
      .sort((a, b) => b.predictedPeriodTotal - a.predictedPeriodTotal)
      .slice(0, 5)
  };
}

export function getAdminMlInsights(options = {}) {
  const context = getOrCreateContext({ refresh: options.refresh });
  const forecastData = buildFutureForecast(context, options);

  return {
    generatedAt: context.generatedAt,
    dataset: {
      source: context.dataset.source,
      mode: context.dataset.mode,
      filePath: context.dataset.filePath,
      records: context.dataset.records.length,
      products: new Set(context.dataset.records.map((record) => record.productId)).size,
      startDate: context.dataset.startDate,
      endDate: context.dataset.endDate,
      catalogCoverage: context.dataset.catalogCoverage
    },
    model: {
      name: "DemandLinearRegressionV1",
      type: "multivariate-linear-regression",
      features: [...FEATURE_KEYS, ...context.categoryMap.categories.map((category) => `category_${category}`)],
      mae: Number(context.metrics.mae.toFixed(2)),
      rmse: Number(context.metrics.rmse.toFixed(2)),
      r2: Number(context.metrics.r2.toFixed(3))
    },
    bestSellers: context.bestSellers,
    demand: forecastData
  };
}
