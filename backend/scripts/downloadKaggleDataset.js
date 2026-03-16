import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = process.cwd();
const dataDir = path.resolve(projectRoot, "data");
const outputPath = path.resolve(dataDir, "kaggle_bakery_sales.csv");

const datasetRef = process.env.KAGGLE_DATASET_REF;
if (!datasetRef) {
  console.error("Missing KAGGLE_DATASET_REF.");
  console.error("Example: KAGGLE_DATASET_REF=rajatkumar30/bakery-sales-data pnpm download:kaggle");
  process.exit(1);
}

fs.mkdirSync(dataDir, { recursive: true });

const result = spawnSync(
  "kaggle",
  ["datasets", "download", "-d", datasetRef, "-p", dataDir, "--unzip"],
  {
    stdio: "inherit",
    shell: true
  }
);

if (result.status !== 0) {
  console.error("Kaggle download failed. Ensure Kaggle CLI and credentials are configured.");
  process.exit(result.status || 1);
}

function findCsvFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const csvFiles = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      csvFiles.push(...findCsvFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".csv")) {
      csvFiles.push(fullPath);
    }
  }

  return csvFiles;
}

const csvFiles = findCsvFiles(dataDir);
if (csvFiles.length === 0) {
  console.error("No CSV files found after download.");
  process.exit(1);
}

const selected = csvFiles[0];
if (path.resolve(selected) !== outputPath) {
  fs.copyFileSync(selected, outputPath);
}

console.log(`Kaggle dataset ready at ${outputPath}`);
