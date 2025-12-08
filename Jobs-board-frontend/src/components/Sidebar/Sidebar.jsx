import "./Sidebar.css";

export default function Sidebar({ onSelectPage }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.user_role;

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">{role} Menu</h2>

      <nav className="sidebar-nav">
        {/* ✅ DASHBOARD FOR ALL */}
        <button
          className="sidebar-item"
          onClick={() => onSelectPage("dashboard")}
        >
          Dashboard
        </button>

        {/* ✅ TRAINEE ONLY */}
        {role === "Trainee" && (
          <button
            className="sidebar-item"
            onClick={() => onSelectPage("applications")}
          >
            My Applications
          </button>
        )}

        {/* ✅ STAFF ONLY */}
        {role === "Staff" && (
          <button
            className="sidebar-item"
            onClick={() => onSelectPage("jobs")}
          >
            Star Companies
          </button>
        )}

        {/* ✅ MENTOR ONLY */}
        {role === "Mentor" && (
          <button
            className="sidebar-item"
            onClick={() => onSelectPage("trainees")}
          >
            My Trainees
          </button>
        )}

        <button className="sidebar-item">Profile</button>
        <button className="sidebar-item">Settings</button>
      </nav>
    </aside>
  );
}
