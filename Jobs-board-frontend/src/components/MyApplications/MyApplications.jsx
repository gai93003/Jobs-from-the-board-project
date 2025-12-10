import JobListView from "../JobListView/JobListView";
import { CommentSection } from "../CommentSection/CommentSection";




export default function MyApplications() {
   const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.user_id;
  const mentorId = user?.mentor_id;

  console.log("MyApplications - User:", user);
  console.log("MyApplications - MentorId:", mentorId);

  return (
    <div>
      <JobListView
        title={`${user.full_name.toUpperCase()} 's Applications`}
        subtitle="Manage your job application progress"
        mode="applications"
      />
      
      {mentorId ? (
        <CommentSection 
          traineeId={userId} 
          mentorId={mentorId} 
          mode="trainee"
        />
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <p>You don't have an assigned mentor yet. Comments will appear here once you're assigned to a mentor.</p>
        </div>
      )}
    </div>
  );
}
