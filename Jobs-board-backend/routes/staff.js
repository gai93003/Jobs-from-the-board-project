import express from "express";
import { pool } from "../DB/db.js";

const router = express.Router();

// STAR A COMPANY (STAFF ONLY)
router.post("/star-company", async (req, res) => {
  try {
    const { company } = req.body;

    if (!company) {
      return res.status(400).json({ error: "Company name is required" });
    }

    const result = await pool.query(
      `INSERT INTO star_companies (company_name)
       VALUES ($1)
       ON CONFLICT (company_name) DO NOTHING
       RETURNING *`,
      [company]
    );

    res.json({
      message: `${company} is now a ⭐ star company`,
      star_company: result.rows[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UNSTAR A COMPANY 
router.delete("/star-company/:company", async (req, res) => {
  try {
    const { company } = req.params;

    await pool.query(
      `DELETE FROM star_companies WHERE company_name = $1`,
      [company]
    );

    res.json({ message: `${company} is no longer a star company` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
