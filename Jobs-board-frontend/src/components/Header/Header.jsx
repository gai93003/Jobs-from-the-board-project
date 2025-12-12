import { logout, getLoggedInUser } from "../../utils/api";
import "./Header.css";
import careerFlowLogo from "../../assets/logo.png";

export default function Header() {
  const user = getLoggedInUser(); 
  return (
    <header className="app-header">
      <div className="header-content">
        <img src={careerFlowLogo} alt="Career Flow Logo" />

        <nav className="header-nav">
          {/* <button className="header-link">Home</button> */}
          {/* <button className="header-link">Dashboard</button> */}
          {user && user.full_name && (
            <h2 className="welcome-text">
              Welcome,{user.full_name.toUpperCase()}
            </h2>
          )}
          <button className="header-link">Profile</button>
          <button className="header-link" onClick={logout}>Logout</button>
        </nav>
      </div>
    </header>
  );
}
