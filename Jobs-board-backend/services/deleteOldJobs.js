import { pool } from '../DB/db.js';
export async function deleteOldJobs() {
  const query = `
    DELETE FROM jobs
    WHERE created_at < CURRENT_DATE - INTERVAL '30 days'
  `;
  const result = await pool.query(query);
  console.log('[CRON] Deleted old jobs:', result.rowCount);
}
