import { logout, getLoggedInUser } from "../../utils/api";
import "./Header.css";
import hamburgerIcon from "../../assets/images-for-components/hamburger.jpg";

export default function Header({ onToggleSidebar }) {
  const user = getLoggedInUser(); 
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-logo">CodeYourFuture</h1>

        <nav className="header-nav">
          {/* <button className="header-link">Home</button> */}
          {/* <button className="header-link">Dashboard</button> */}
          {user && user.full_name && (
            <h2 className="welcome-text">
              Welcome,{user.full_name.toUpperCase()}
            </h2>
          )}
          {/* <button className="header-link">Profile</button> */}
          <button className="menu-btn" onClick={onToggleSidebar}>
            <img className="hamburger" src={hamburgerIcon} alt="Menu" />
          </button>
          <button className="header-link" onClick={logout}>Logout</button>
        </nav>
      </div>
    </header>
  );
}
