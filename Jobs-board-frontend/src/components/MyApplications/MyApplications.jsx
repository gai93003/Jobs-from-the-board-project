import JobListView from "../JobListView/JobListView";




export default function MyApplications() {
   const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.user_id;


  return (
    <JobListView
      title={`${user.full_name.toUpperCase()} 's Applications`}
      subtitle="Manage your job application progress"
      mode="applications"

    />
  );
}
