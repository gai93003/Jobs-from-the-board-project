import JobListView from "../JobListView/JobListView";


export function Dashboard() {
  return (
    <JobListView
      title="All Jobs"
      subtitle="Jobs from API:"
      fetchJobs={fetchApiJobs}      // API fetch only here
    />
  );
}

export async function fetchApiJobs() {
  const response = await fetch("https://devitjobs.uk/api/jobsLight");
  const data = await response.json();

  // filter example: only "Regular" & "Junior"
  return data.filter(job =>
    job.expLevel === "Regular" ||
    job.expLevel === "Junior"
  ).slice(0,15);  // Only show last 10 jobs
}


// ******************* I can add Slack chennel API here ********************