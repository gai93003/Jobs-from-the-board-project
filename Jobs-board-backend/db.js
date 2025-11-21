import pkg from "pg";
import dotenv from "dotenv"
dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jobsdb",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

pool.connect().then(() => console.log("DB Connected via Pool"))


