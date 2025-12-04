import { pool } from '../DB/db.js'; // required for database version

export async function findJobByExternalId(external_job_id, source) {
  const result = await pool.query(
    'SELECT job_id FROM jobs WHERE external_job_id = $1 AND source = $2',
    [external_job_id, source]
  );
  return result.rows[0] || null;
}

// list all jobs from the database, with optional filters
export async function getAllJobs({ location, employment_type, company, approved, userId } = {}) {
  // build same WHERE conditions but query includes LEFT JOIN
  const conditions = [];
  const values = [];
  let idx = 1;

  if (location) { conditions.push(`j.location ILIKE $${idx++}`); values.push(`%${location}%`); }
  if (employment_type) { conditions.push(`j.employment_type = $${idx++}`); values.push(employment_type); }
  if (company) { conditions.push(`j.company ILIKE $${idx++}`); values.push(`%${company}%`); }

  if (approved !== undefined) {
    if (approved === true) conditions.push(`j.approved_at IS NOT NULL`);
    else conditions.push(`j.approved_at IS NULL`);
  }

  // Left join applications filtered to the provided userId
  const userJoin = userId ? `LEFT JOIN applications a ON a.job_id = j.job_id AND a.user_id = $${idx++}` : `LEFT JOIN applications a ON a.job_id = j.job_id AND false`;
  if (userId) values.push(userId);

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT j.*, a.application_id, a.status as application_status
    FROM jobs j
    ${userJoin}
    ${whereClause}
    ORDER BY j.job_id DESC
  `;

  const result = await pool.query(query, values);
  return result.rows;
}

// finding one job by its ID from the database
export async function getJobById(id) {
  const result = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [id]);
  return result.rows[0];
}

// created a new job in the database
export async function createJob(jobData) {
  const {
    title, company, location, employment_type, tech_stack,
    source, external_job_id, apply_url, approved_at, exp_level, partner_name, active_from
  } = jobData;

  const result = await pool.query(
    `INSERT INTO jobs (
      title, company, location, employment_type, tech_stack,
      source, external_job_id, apply_url, approved_at, exp_level, partner_name, active_from
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [title, company, location, employment_type, tech_stack,
     source, external_job_id, apply_url, approved_at, exp_level, partner_name, active_from]
  );
  return result.rows[0];
}


export default {
  getAllJobs,
  getJobById,
  createJob,
  findJobByExternalId 
};
