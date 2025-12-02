import { useState, useEffect } from "react";
import { JobCard } from "../JobCard/JobCard";


export default function JobListView({
  title,
  subtitle,

  // UNIVERSAL fetch function → used by Dashboard
  fetchJobs,

  // If true:  My Applications mode
  showUserSelect = false,

  // User dropdown functions : used by My Applications
  loadUsers,
  fetchJobsForUser
}) {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);

  // Load either:
  // - API jobs (Dashboard)
  // - Users list (My Applications)
  useEffect(() => {
    async function init() {
      if (showUserSelect) {
        // Load user dropdown list
        const userList = await loadUsers();
        setUsers(userList);
        setLoading(false);
      } else {
        // Load jobs from API (Dashboard)
        const data = await fetchJobs();
        setJobs(data);
        setLoading(false);
      }
    }

    init();
  }, [showUserSelect, fetchJobs, loadUsers]);

  // Handle selecting a user and loading their jobs
  const handleUserSelect = async (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);

    if (!userId) {
      setJobs([]);
      return;
    }

    setLoading(true);
    const userJobs = await fetchJobsForUser(userId);
    setJobs(userJobs);
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <h1 className="title">{title}</h1>
      <p className="subtitle">{subtitle}</p>

      {showUserSelect && (
        <select
          className="dropdown"
          value={selectedUser}
          onChange={handleUserSelect}
        >
          <option value="">-- Choose user --</option>
          {users.map((u) => (
            <option key={u.user_id} value={u.user_id}>
              {u.fullname}
            </option>
          ))}
        </select>
      )}

      <hr className="divider" />

      {loading && <p className="loading">Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p className="no-jobs">No jobs found.</p>
      )}

      <ul className="jobs-list">
        {jobs.map((job) => (
          <JobCard key={job.job_id || job._id} {...job} />
        ))}
      </ul>
    </div>
  );
}


