import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const { Client } = pkg;

const DB_NAME = "jobsdb";
const DB_USER = "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = "localhost";
const DB_PORT = 5432;

async function ensureDatabase() {
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: "postgres",
  });

  await client.connect();

  const result = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [DB_NAME]
  );

  if (result.rowCount === 0) {
    console.log(`Database ${DB_NAME} does not exist. Creating...`);
    await client.query(`CREATE DATABASE ${DB_NAME}`);
  } else {
    console.log(`Database ${DB_NAME} already exists.`);
  }

  await client.end();
}

async function ensureTables() {
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_NAME,
  });

  await client.connect();

  const sql = fs.readFileSync("./db_setup.sql", "utf8");
  await client.query(sql);

  console.log("Tables & enums ensured.");
  await client.end();
}

export async function runSetup() {
  await ensureDatabase();
  await ensureTables();
}
