import { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api.js";
import { markCompanyAsStar, unstarCompany } from "../../utils/staff.js";
import "./StaffPage.css";

export default function StaffPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      const res = await fetchWithAuth("/jobs/all");
      setJobs(res.data.jobs || []);
      setLoading(false);
    }

    loadJobs();
  }, []);

  async function handleStar(job) {
    await markCompanyAsStar(job.company);

    setJobs((prev) =>
      prev.map((j) =>
        j.company === job.company
          ? { ...j, is_star: true }
          : j
      )
    );
  }

  async function handleUnstar(job) {
    await unstarCompany(job.company);

    setJobs((prev) =>
      prev.map((j) =>
        j.company === job.company
          ? { ...j, is_star: false }
          : j
      )
    );
  }

  return (
    <div className="staff-dashboard">
      <h1 className="staff-title">Staff Dashboard — Star Companies</h1>

      {loading && <p>Loading jobs...</p>}

      {!loading && (
        <table className="staff-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Star Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job.job_id}>
                <td>{job.title}</td>
                <td>
                  {job.company} {job.is_star && "⭐"}
                </td>
                <td>{job.location}</td>
                <td>{job.is_star ? "Star Company" : "Normal"}</td>
                <td>
                  {!job.is_star ? (
                    <button
                      className="staff-star-btn"
                      onClick={() => handleStar(job)}
                    >
                      Mark as ⭐
                    </button>
                  ) : (
                    <button
                      className="staff-star-btn-remove"
                      onClick={() => handleUnstar(job)}
                    >
                      Remove ⭐
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
