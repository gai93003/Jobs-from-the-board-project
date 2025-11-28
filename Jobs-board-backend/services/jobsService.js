import { pool } from '../DB/db.js'; // required for database version

export async function findJobByApplyUrl(apply_url) {
  const result = await pool.query(
    'SELECT job_id FROM jobs WHERE apply_url = $1',
    [apply_url]
  );
  return result.rows[0] || null;
}
// list all jobs from the database, with optional filters
export async function getAllJobs({ location, employment_type, company, approved } = {}) {
  const conditions = [];
  const values = [];
  let index = 1;

  if (location) {
    conditions.push(`location ILIKE $${index++}`);
    values.push(`%${location}%`);
  }

  if (employment_type) {
    conditions.push(`employment_type = $${index++}`);
    values.push(employment_type);
  }

  if (company) {
    conditions.push(`company ILIKE $${index++}`);
    values.push(`%${company}%`);
  }

  if (approved !== undefined) {
    if (approved === true) {
      conditions.push(`approved_at IS NOT NULL`);
    } else if (approved === false) {
      conditions.push(`approved_at IS NULL`);
    }
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `SELECT * FROM jobs ${whereClause} ORDER BY job_id DESC`;

  const result = await pool.query(query, values);
  return result.rows;
};

// finding one job by its ID from the database
export async function getJobById(id) {
  const result = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [id]);
  return result.rows[0];
}

// created a new job in the database
export async function createJob(data) {
  const { title, company, location, employment_type, tech_stack, exp_level,partner_name, source, apply_url, approved_at } = data;
  const result = await pool.query(
    `INSERT INTO jobs (title, company, location, employment_type,exp_level, partner_name, tech_stack, source, apply_url, approved_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [title, company, location, employment_type, tech_stack, exp_level, partner_name, source, apply_url, approved_at]
  );
  return result.rows[0];
}

export default {
  getAllJobs,
  getJobById,
  createJob,
  findJobByApplyUrl
};
