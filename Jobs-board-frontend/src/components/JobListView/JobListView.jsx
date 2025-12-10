import { useState, useEffect } from "react";
import { JobCard } from "../JobCard/JobCard";
import { markJobInterested, fetchUserApplications, updateApplicationStatus } from "../../utils/applications.js";
import "../Dashboard/Dashboard.css"
const PAGE_SIZE = 6;

export default function JobListView({
  subtitle,
  fetchJobs,       // normal jobs API
  fetchJobsSlack,  // Slack jobs API
  mode = "dashboard",
}) {
  const [apiJobs, setApiJobs] = useState([]);
  const [slackJobs, setSlackJobs] = useState([]);
  const [page, setPage] = useState(1);
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
//         const jobsList = await fetchJobs();
        const params = new URLSearchParams();
        if (location) params.set("location", location);
        if (locationType) params.set("location_type", locationType);
        if (expLevel) params.set("exp_level", expLevel);
        if (techStack) params.set("tech_stack", techStack);
        const queryString = params.toString() ? `?${params.toString()}` : "";

        // fetch normal jobs, slack jobs, and existing applications in parallel
        const [apiData, slackData, apps] = await Promise.all([
          fetchJobs(queryString),
          fetchJobsSlack(queryString), 
          fetchUserApplications()
        ]);

        setApiJobs(apiData || []);
        setSlackJobs(slackData || []);

        const interested = new Set(
          (apps?.data?.applications || []).map(app => app.job_id)
        );
        setInterestedJobs(interested);

        setPage(1);
      } else if (mode === "applications") {
        const apps = await fetchUserApplications();
        setApiJobs(apps?.data?.applications || []);
        setSlackJobs(apps?.data?.applications || []);              // no Slack section in My Applications
        setInterestedJobs(new Set());  // not needed here
        setPage(1);
      }

      setLoading(false);
    }

    load();
  }, [ mode, fetchJobs,fetchJobsSlack, location, locationType, expLevel, techStack,]);

  // pagination
  const slackStart = (page - 1) * PAGE_SIZE;
  const slackEnd = slackStart + PAGE_SIZE;
  const apiStart = (page - 1) * PAGE_SIZE;
  const apiEnd = apiStart + PAGE_SIZE;

  const pagedSlackJobs = slackJobs.slice(slackStart, slackEnd);
  const pagedApiJobs = apiJobs.slice(apiStart, apiEnd);

  const totalPages = Math.max(
    Math.ceil(slackJobs.length / PAGE_SIZE),
    Math.ceil(apiJobs.length / PAGE_SIZE),
    1
  );

  // mark job as interested (for BOTH Slack + platform)
  async function handleInterested(job) {
    try {
      const result = await markJobInterested(job.job_id);

      if (result && result.response && result.response.ok) {
        setInterestedJobs(prev => new Set([...prev, job.job_id]));
        console.log("Job marked as interested successfully!");
      }
    } catch (error) {
      console.error("Error marking job as interested:", error);
      alert(`Failed to mark job as interested: ${error.message}`);
    }
  }

  // update application status (My Applications view)
  async function handleStatusChange(application_id, newStatus) {
    await updateApplicationStatus(application_id, newStatus);

    setApiJobs(prev =>
      prev.map(job =>
        job.application_id === application_id
          ? { ...job, status: newStatus }
          : job
      )
    );
  }

  return (
    <div className="dashboard-container">
      {subtitle && <p className="subtitle">{subtitle}</p>}

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

      {/* Slack jobs section (dashboard only) */}
      {!loading && mode === "dashboard" && pagedSlackJobs.length > 0 && (
        <>
          <h2 className="section-title">CYF Slack Jobs</h2>

          <ul className="jobs-grid">
            {pagedSlackJobs.map((job, i) => (
              <JobCard
                key={`slack-${job.job_id}-${i}`}
                {...job}
                onInterested={handleInterested}
                isInterested={interestedJobs.has(job.job_id)}
              />
            ))}
          </ul>

          <hr className="divider" />
        </>
      )}

      {/* 💼 Platform jobs / My applications */}
      {!loading && (
        <>
          {mode === "dashboard" && (
            <h2 className="section-title">Platform Jobs</h2>
          )}
          {mode === "applications" && (
            <h2 className="section-title">My Applications</h2>
          )}

          {pagedApiJobs.length === 0 && (
            <p className="no-jobs">No jobs found.</p>
          )}

          {pagedApiJobs.length > 0 && (
            <ul className="jobs-grid">
              {pagedApiJobs.map((job, i) => (
                <JobCard
                  key={
                    mode === "dashboard"
                      ? `api-${job.job_id}-${i}`
                      : `app-${job.application_id}-${i}`
                  }
                  {...job}
                  {...(mode === "dashboard"
                    ? {
                        onInterested: handleInterested,
                        isInterested: interestedJobs.has(job.job_id),
                      }
                    : {
                        onStatusChange: newStatus =>
                          handleStatusChange(job.application_id, newStatus),
                      })}
                />
              ))}
            </ul>
          )}
        </>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            ← Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
