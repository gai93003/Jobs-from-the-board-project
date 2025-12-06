import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { fetchWithAuth } from "../../utils/api";
import "./MentorPage.css";

export function MentorPage() {
    const [trainees, setTrainees] = useState([]);
    const [selectedTrainee, setSelectedTrainee] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fetch trainees on component mount
    useEffect(() => {
        fetchTrainees();
    }, []);

    const fetchTrainees = async () => {
        setIsLoading(true);
        try {
            const result = await fetchWithAuth("/trainees");
            if (result && result.data) {
                setTrainees(result.data.trainees || []);
            }
        } catch (error) {
            console.error("Error fetching trainees:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTraineeChange = (e) => {
        setSelectedTrainee(e.target.value);
    };

  return (
    <div className="mentor-page">
      <Header />

      <div className="mentor-layout">
        <main className="trainee-content">
          <div className="mentor-dropdown-section">
            <h2>Select a Trainee</h2>
            <select 
              value={selectedTrainee} 
              onChange={handleTraineeChange}
              disabled={isLoading}
              className="mentor-dropdown"
            >
              <option value="">-- Select a Trainee --</option>
              {trainees.map((trainee) => (
                <option key={trainee.user_id} value={trainee.user_id}>
                  {trainee.full_name} - {trainee.email}
                </option>
              ))}
            </select>
            {selectedTrainee && (
              <p className="selected-mentor-info">
                Selected Trainee ID: {selectedTrainee}
              </p>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
