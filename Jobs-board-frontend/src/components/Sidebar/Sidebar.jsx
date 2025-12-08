import "./Sidebar.css";

export default function Sidebar({onSelectPage}) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Trainee Menu</h2>

      <nav className="sidebar-nav">
        <button className="sidebar-item" onClick={() => onSelectPage("dashboard")}>
          Dashboard
        </button>

        <button className="sidebar-item" onClick={() => onSelectPage("applications")}>
          My Applications
        </button>

        <button className="sidebar-item" onClick={() => onSelectPage("profile")}>Profile</button>
        <button className="sidebar-item">Settings</button>
      </nav>
    </aside>
  );
}