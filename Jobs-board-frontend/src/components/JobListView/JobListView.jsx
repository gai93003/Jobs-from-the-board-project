import { useState, useEffect } from "react";
import { JobCard } from "../JobCard/JobCard";
import { fetchUserApplications, updateApplicationStatus, markJobInterested } from "../../utils/applications.js";



export default function JobListView({
  title,
  subtitle,
  fetchJobs,      // dashboard only
  mode = "dashboard",
}) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interestedJobs, setInterestedJobs] = useState(new Set());
  const [location, setLocation] = useState("");
  const [expLevel, setExpLevel] = useState("");
  const [techStack, setTechStack] = useState("");
  const [locationType, setLocationType] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      if (mode === "dashboard") {

         // fetchJobs() returns an ARRAY, not an object
      const jobsList = await fetchJobs();
      setJobs(jobsList);
      
      // Fetch user applications to check which jobs are already marked as interested
      const apps = await fetchUserApplications();
      const interested = new Set(
        apps.data.applications.map(app => app.job_id)
      );
      setInterestedJobs(interested);
    }

        const params = new URLSearchParams();
        if (location) params.set("location", location);
        if (locationType) params.set("location_type", locationType);
        if (expLevel) params.set("exp_level", expLevel);
        if (techStack) params.set("tech_stack", techStack);

        const queryString = params.toString() ? `?${params.toString()}` : "";
        const jobsList = await fetchJobs(queryString);
        setJobs(jobsList);
      }


      if (mode === "applications") {
        const apps = await fetchUserApplications();
        setJobs(apps.data.applications);
      }

      setLoading(false);
    }

    load();
  }, [mode, fetchJobs, location,expLevel, techStack]); // ← include filters here

  async function handleInterested(job) {
    try {
      const result = await markJobInterested(job.job_id);
      
      // Check if successful
      if (result && result.response.ok) {
        // Add to interested jobs set
        setInterestedJobs(prev => new Set([...prev, job.job_id]));
        
        // Show success message
        console.log("✅ Job marked as interested successfully!");
      }
    } catch (error) {
      console.error("Error marking job as interested:", error);
      alert(`Failed to mark job as interested: ${error.message}`);
    }
  }

  async function handleStatusChange(application_id, newStatus) {
    await updateApplicationStatus(application_id, newStatus);
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

      {/* Filters only on dashboard mode */}
      {mode === "dashboard" && (
        <div className="filters">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <select
          value={locationType}
          onChange={e => setLocationType(e.target.value)}>
          <option value="">Any location type</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">Onsite</option>
        </select>

          <select
            value={expLevel}
            onChange={e => setExpLevel(e.target.value)}
          >
            <option value="">Any level</option>
            <option value="junior">Junior</option>
            <option value="regular">Regular</option>
          </select>

          <input
            type="text"
            placeholder="Tech (e.g. React)"
            value={techStack}
            onChange={e => setTechStack(e.target.value)}
          />
        </div>
      )}

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
            ? { 
                onInterested: handleInterested,
                isInterested: interestedJobs.has(job.job_id)
              }
            : { onStatusChange: (newStatus) => handleStatusChange(job.application_id, newStatus) }
          )}

          />
        ))}
      </ul>
    </div>
  );
}

