import dotenv from "dotenv"
dotenv.config({ debug: true });
import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "jobsdb",
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

pool.connect().then(() => console.log("DB Connected via Pool"))


