import { fetchWithAuth } from "../../utils/api";
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
  const response = await fetchWithAuth("/jobs/all");
  console.log(response)
    return response.data.jobs.sort((a, b) => new Date(b.active_from) - new Date(a.active_from));


}


// ******************* I can add Slack chennel API here ********************