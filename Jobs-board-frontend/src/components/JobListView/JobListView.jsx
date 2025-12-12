import { useState, useEffect } from "react";
import { JobCard } from "../JobCard/JobCard";
import { markJobInterested, fetchUserApplications, updateApplicationStatus } from "../../utils/applications.js";
import { applyStarFilter, sortJobs } from "../../utils/jobListHelper.js";
import "../Dashboard/Dashboard.css"
const PAGE_SIZE = 6;

export default function JobListView({
  subtitle,
  fetchJobs,       // normal jobs API
  fetchJobsSlack,  // Slack jobs API
  mode = "dashboard",
}) {
  console.log("JobListView RENDERED"); 
  const [apiJobs, setApiJobs] = useState([]);
  const [slackJobs, setSlackJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [interestedJobs, setInterestedJobs] = useState(new Set());
  const [location, setLocation] = useState("");
  const [expLevel, setExpLevel] = useState("");
  const [techStack, setTechStack] = useState("");
  const [locationType, setLocationType] = useState("");
  const [sortBy, setSortBy] = useState("date");      // "date" | "salary"
  const [sortDirection, setSortDirection] = useState("desc"); // "asc" | "desc"
  const [starCompaniesOnly, setStarCompaniesOnly] = useState(false);


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
        if (starCompaniesOnly) params.set("star_companies", "true");
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
  }, [ mode, fetchJobs,fetchJobsSlack, location, locationType, expLevel, techStack, starCompaniesOnly, sortBy, sortDirection]);

 
  // Filter + sort pipeline
  const filteredSlackJobs = applyStarFilter(slackJobs, starCompaniesOnly);
  const filteredApiJobs = applyStarFilter(apiJobs, starCompaniesOnly);

  const sortedSlackJobs = sortJobs(filteredSlackJobs, sortBy, sortDirection);
  const sortedApiJobs = sortJobs(filteredApiJobs, sortBy, sortDirection);

  // pagination
  const slackStart = (page - 1) * PAGE_SIZE;
  const slackEnd = slackStart + PAGE_SIZE;
  const apiStart = (page - 1) * PAGE_SIZE;
  const apiEnd = apiStart + PAGE_SIZE;

  const pagedSlackJobs = sortedSlackJobs.slice(slackStart, slackEnd);
  const pagedApiJobs = sortedApiJobs.slice(apiStart, apiEnd);

  const totalPages = Math.max(
    Math.ceil(sortedSlackJobs.length / PAGE_SIZE),
    Math.ceil(sortedApiJobs.length / PAGE_SIZE),
    1
  );
console.log("pagedApiJobs:", pagedApiJobs); 

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
         
          <select // New: sort by daate
            value={`date-${sortDirection}`}
            onChange={e => {
              const dir = e.target.value.split("-")[1];
              setSortBy("date");
              setSortDirection(dir);
            }}
          >
            <option value="date-desc">Date posted: Newest first</option>
            <option value="date-asc">Date posted: Oldest first</option>
            </select>
            <select
            value={`salary-${sortDirection}`}
            onChange={e=>{
              const dir =e.target.value.split("-")[1];
              setSortBy("salary");
              setSortDirection(dir);
            }}
            >
            <option value="salary-asc">Base salary: Low to high</option>
            <option value="salary-desc">Base salary: High to low</option>
            </select>

           <input // star filter is here
          type="checkbox"
          checked={starCompaniesOnly}
          onChange={e => setStarCompaniesOnly(e.target.checked)}
          />
          Star employers only
         
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
                  is_star={job.is_star} // star employer 
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
