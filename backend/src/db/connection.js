import mysql from "mysql2/promise";

const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL || "";
const sslEnabled = ["1", "true", "yes", "required"].includes(
  String(process.env.DB_SSL || "").trim().toLowerCase()
);

const baseConfig = {
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = connectionUri
  ? mysql.createPool({
      uri: connectionUri,
      ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
      ...baseConfig
    })
  : mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "sakthi_bakers",
      ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
      ...baseConfig
    });

export default pool;
