import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const dummyLoginData = [2, 4, 3, 6, 5, 7, 4];
  const totalLogins = dummyLoginData.reduce((sum, n) => sum + n, 0);

  const dummyAnomalousData = [0, 1, 0, 2, 0, 1, 0];
  const totalAnomalous = dummyAnomalousData.reduce((sum, n) => sum + n, 0);

  const dummyLastLogin = "2026-03-08T21:42:00.000Z";
  const formattedLastLogin = new Date(dummyLastLogin).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
            <p className="stat-value">{totalLogins}</p>
            <div className="mini-graph" aria-label="Weekly login activity">
              {dummyLoginData.map((count, index) => (
                <div 
                  key={index}
                  className="mini-bar"
                  style={{ height: `${count * 10}px` }}
                  title={`Day ${index + 1}: ${count}`}
                />
              ))}
            </div>
            <p className="graph-label">Last 7 days (dummy) </p>
          </div>
          <div className="stat-card">
            <h3> Anamolous Logins </h3>
            <p className="stat-value">{totalAnomalous}</p>
            <div className="mini-graph" aria-label="Weekly anomalous login activity">
              {dummyAnomalousData.map((count, index) => (
                <div 
                  key={index}
                  className="mini-bar"
                  style={{ height: `${count * 20}px` }}
                  title={`Day ${index + 1}: ${count} anomalous`}
                />
              ))}
            </div>
          </div>
          <div className="stat-card">
            <h3> Last Login </h3>
            <p className="stat-value" >{formattedLastLogin}</p>
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