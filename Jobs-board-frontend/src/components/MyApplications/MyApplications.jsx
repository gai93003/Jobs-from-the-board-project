import JobListView from "../JobListView/JobListView";
import { getApplicationsByUser } from "../../utils/applicationsApi";

export default function MyApplications() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.user_id;

  async function fetchInterestedJobs() {
    if (!userId) return [];
    const apps = await getApplicationsByUser(userId);
    const interestedApps = apps.filter(app => app.status === "Interested");

    // Map application rows into the shape JobCard expects
    return interestedApps.map(app => ({
      job_id: app.job_id,
      title: app.job_title || app.title,
      company: app.company,
      location: app.location,
      employment_type: app.employment_type,
      exp_level: app.exp_level,
      partner_name: app.partner_name,
      apply_url: app.apply_url,
      active_from: app.active_from,
    }));
  }

  return (
    <JobListView
      title="My Interesting Jobs"
      subtitle="Jobs you have marked as interesting:"
      fetchJobs={fetchInterestedJobs}
      showUserSelect={false}
      loadUsers={null}
      fetchJobsForUser={null}
    />
  );
}
