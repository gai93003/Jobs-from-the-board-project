import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login/Login.jsx';
import {TraineePage} from './pages/TraineePage/TraineePage.jsx';
import {MentorPage} from './pages/mentorPage/MentorPage.jsx';
import SignUp from "./pages/SignUp/SignUp.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<SignUp />} />

      <Route path="/trainee" element={<TraineePage />} />
      
      <Route path="/mentor" element={<MentorPage />} />
    </Routes>
  );
}

export default App;
