import { logout } from "../../utils/api";
import "./Header.css";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="header-logo">CodeYourFuture</h1>

        <nav className="header-nav">
          <button className="header-link">Home</button>
          <button className="header-link">Dashboard</button>
          <button className="header-link">Profile</button>
          <button className="header-link" onClick={logout}>Logout</button>
        </nav>
      </div>
    </header>
  );
}
