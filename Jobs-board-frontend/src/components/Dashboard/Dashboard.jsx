import { fetchWithAuth } from "../../utils/api";
import JobListView from "../JobListView/JobListView";
import { getLoggedInUser } from "../../utils/api";


export function Dashboard() {
    const user = getLoggedInUser();

  return (
    <JobListView
      title={`Welcome, " ${user.full_name.toUpperCase()}`}
      subtitle="All Jobs from API:"
      mode="dashboard"
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