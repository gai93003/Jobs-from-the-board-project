// import fetch from "node-fetch";
import { pool } from "../DB/db.js";

function parseSlackJob(text) {
  const get = (label) => {
    const regex = new RegExp(`\\*${label}\\*\\n([^\\n]+)`, "i");
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  const title = get("Job Title");
  const location = get("Location");
  const location_type = get("Work Type");
  const tech_stack = get("Tech Stack");
  const company = get("Company");
  const employment_type = get("Employment Type")
  // const apply_url = get("Apply URL")

  const urlMatch = text.match(/\*Apply URL\*\n<([^>]+)>/i);
  const apply_url = urlMatch ? urlMatch[1] : null;

  if (!title || !apply_url) return null;

  return {
    title,
    location,
    location_type,
    employment_type,
    tech_stack,
    apply_url,
    company,
  };
}

export async function fetchAndStoreSlackJobs() {
console.log("🔄 Slack job fetch started...");
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_CHANNEL_ID;

  const res = await fetch(
    `https://slack.com/api/conversations.history?channel=${channel}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  );

  const data = await res.json();

  if (!data.ok) {
    console.error("❌ Slack API error:", data.error);
    return;
  }

  for (const msg of data.messages) {
    if (!msg.text) continue;

    const job = parseSlackJob(msg.text);
    if (!job) continue;

    await pool.query(
      `
      INSERT INTO jobs
        (title, company, location, apply_url, location_type, tech_stack,employment_type, api_source, partner_name)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, 'CYFslack','CYF Slack')
      `,
      [
        job.title,
        job.company,
        job.location,
        job.apply_url,
        job.location_type,
        job.tech_stack,
        job.employment_type
      ]
    );
  }

  console.log("Slack jobs synced successfully");
}
