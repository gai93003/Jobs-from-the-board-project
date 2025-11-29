
import { useState } from "react";
import { Dashboard } from "../../components/Dashboard/Dashboard";
import MyApplications from "../../components/MyApplications/MyApplications";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./TraineePage.css";

export function TraineePage() {
  const [activePage, setActivePage] = useState("dashboard"); 
  // dashboard is default

  return (
    <div className="trainee-page">
      <Header />

      <div className="trainee-layout">
        <Sidebar onSelectPage={setActivePage} />

        <main className="trainee-content">
          {activePage === "dashboard" && <Dashboard />}
          
        </main>
      </div>

      <Footer />
    </div>
  );
}
