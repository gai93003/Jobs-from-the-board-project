import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { fetchWithAuth } from "../../utils/api.js";
import { TraineeApplications } from "../TraineeApplications/TraineeApplications";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "chart.js/auto";
import "./StaffDashboard.css";

export default function StaffDashboard() {
  const [funnel, setFunnel] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState(null); 

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const funnelRes = await fetchWithAuth("/staff/cohort/funnel");
    setFunnel(funnelRes.data);

    const traineeRes = await fetchWithAuth("/staff/cohort/trainees");
    setTrainees(mapTraineeData(traineeRes.data.rows));
  }

  // When clicking back
  const handleBack = () => {
    setSelectedTrainee(null);
  };

  // IF TRAINEE IS SELECTED → SHOW THEIR APPLICATIONS
  if (selectedTrainee) {
    return (
     <div className="staff-dashboard">
          <Header />
          <div className="mentor-layout">
            <main className="trainee-content">
                <TraineeApplications
                    trainee={selectedTrainee}
                    onBack={handleBack}
                />
            </main>
          </div>
          <Footer />
        </div>
    );
  }

  if (!funnel) return <p>Loading dashboard...</p>;

  const chartData = {
    labels: Object.keys(funnel.stats),
    datasets: [
      {
        data: Object.values(funnel.stats),
        backgroundColor: ["#2196F3", "#FF9800", "#F44336", "#4CAF50"]
      }
    ]
  };

  return (
    <div className="staff-dashboard">
      <h1>Cohort Application</h1>
      <p className="cohort-name">Launch Module Nov25</p>

      {/* SUMMARY CARDS  */}
      <div className="summary-grid">
        <Summary title="Submitted" value={funnel.stats["Application Submitted"]} />
        <Summary title="Interview" value={funnel.stats["Invited to Interview"]} />
        <Summary title="Declined" value={funnel.stats["Application Declined"]} />
        <Summary title="Offers" value={funnel.stats["Offer Received"]} />
      </div>

      {/* TRAINEE STATUS TABLE */}
      <table className="staff-table">
        <thead>
          <tr>
            <th>Trainee</th>
            <th>Submitted</th>
            <th>Interview</th>
            <th>Declined</th>
            <th>Offer</th>
          </tr>
        </thead>
        <tbody>
          {trainees.map((t) => (
            <tr key={t.user_id}>
              {/* CLICKABLE TRAINEE NAME */}
              <td
                className="trainee-name-link"
                onClick={() => setSelectedTrainee(t)}
                style={{ cursor: "pointer", color: "#EE4344", fontWeight: 600 }}
              >
                {t.full_name}
              </td>
              <td>{t["Application Submitted"]}</td>
              <td>{t["Invited to Interview"]}</td>
              <td>{t["Application Declined"]}</td>
              <td>{t["Offer Received"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PIE CHART */}
      <div className="pie-section">
        <h2>Application Distribution Chart</h2>
        <Pie data={chartData} />
      </div>
    </div>
  );
}

function Summary({ title, value }) {
  return (
    <div className="summary-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function mapTraineeData(rows) {
  const map = {};

  rows.forEach((row) => {
    if (!map[row.user_id]) {
      map[row.user_id] = {
        user_id: row.user_id,
        full_name: row.full_name,
        email: row.email,
        "Application Submitted": 0,
        "Invited to Interview": 0,
        "Application Declined": 0,
        "Offer Received": 0,
      };
    }

    if (map[row.user_id][row.status] !== undefined) {
      map[row.user_id][row.status] += row.total;
    }
  });

  return Object.values(map);
}
