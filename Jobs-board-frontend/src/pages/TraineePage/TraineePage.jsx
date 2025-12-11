
import { useState } from "react";
import { Dashboard } from "../../components/Dashboard/Dashboard";
import MyApplications from "../../components/MyApplications/MyApplications";
import { Profile } from "../../components/Profile/Profile";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import Insights from "../../components/Insights/Insights";
import "./TraineePage.css";

export function TraineePage() {
  const [activePage, setActivePage] = useState("dashboard"); 
  // dashboard is default

  return (
    <div className="trainee-page">
      <Header />

      <div className="trainee-layout">
        <Sidebar activePage={activePage} onSelectPage={setActivePage} />

        <main className="trainee-content">
          {activePage === "dashboard" && <Dashboard />}
          {activePage === "applications" && <MyApplications />}
          {activePage === "profile" && <Profile />}
          {activePage === "insights" && <Insights />}
        </main>
      </div>

      <Footer />
    </div>
  );
}
