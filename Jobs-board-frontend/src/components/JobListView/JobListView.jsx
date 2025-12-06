import { useState, useEffect } from "react";
import { JobCard } from "../JobCard/JobCard";
import { markJobInterested, fetchUserApplications, updateApplicationStatus } from "../../utils/applications.js";


export default function JobListView({
title,
  subtitle,
  fetchJobs,      // dashboard only
  mode = "dashboard",
}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    async function load() {
      setLoading(true);

      if (mode === "dashboard") {
         // fetchJobs() returns an ARRAY, not an object
      const jobsList = await fetchJobs();
      setJobs(jobsList);
    }

      if (mode === "applications") {
        const apps = await fetchUserApplications();
        setJobs(apps.data.applications);
      }

      setLoading(false);
    }

    load();
  }, [mode, fetchJobs]);

  async function handleInterested(job) {
    await markJobInterested(job.job_id);
    alert("Marked as Interested!");
  }

  async function handleStatusChange(application_id, newStatus) {
  await updateApplicationStatus(application_id, newStatus);

  // update local state so UI refreshes immediately
  setJobs(jobs.map(job =>
    job.application_id === application_id
      ? { ...job, status: newStatus }
      : job
  ));
}

  return (
    <div className="dashboard-container">
      <h1 className="title">{title}</h1>
      <p className="subtitle">{subtitle}</p>

      <hr className="divider" />

      {loading && <p className="loading">Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <p className="no-jobs">No jobs found.</p>
      )}

      <ul className="jobs-list">
        {jobs.map((job) => (
          <JobCard key={job.job_id} {...job}
          {...(
            mode === "dashboard"
            ? { onInterested: handleInterested }
            : { onStatusChange: (newStatus) => handleStatusChange(job.application_id, newStatus) }
          )}
          />
        ))}
      </ul>
    </div>
  );
}


