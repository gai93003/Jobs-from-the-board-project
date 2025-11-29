import JobListView from "../JobListView/JobListView";
import { getUsers, getJobsByUser } from "../Dashboard/MockData";

export default function MyApplications() {
  return (
    <JobListView
      title="My Applications"
      subtitle="Select a user to view their applications:"
      showUserSelect={true}
      loadUsers={getUsers}
      fetchJobsForUser={getJobsByUser}
      // fetchJobs={() => []}    
    />
  );
}
