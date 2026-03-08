import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchProtected = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/auth/protected",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage(response.data.message);
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    fetchProtected();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-section">
        <h2>Welcome 👋</h2>

        {user && (
          <>
            <p><strong>Username:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </>
        )}

        <p className="message">{message}</p>
      </div>
      
      <div className="statistics-section">
        <h2> Account Statistics </h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Logins</h3>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card">
            <h3> Anamolous Logins </h3>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card">
            <h3> Last Login </h3>
            <p className="stat-value" >N/A </p>
          </div>
          <div className="stat-card">
            <h3> Account Status </h3>
            <p className="stat-value">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
