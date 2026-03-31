import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

function Dashboard() {

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [loginLogs, setLoginLogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [acknowledged, setAcknowledged] = useState(false);

  const token = localStorage.getItem("token");

  // Dummy graph data
  const dummyLoginData = [2, 4, 3, 6, 5, 7, 4];
  const totalLogins = dummyLoginData.reduce((sum, n) => sum + n, 0);

  const dummyAnomalousData = [0, 1, 0, 2, 0, 1, 0];
  const totalAnomalous = dummyAnomalousData.reduce((sum, n) => sum + n, 0);

  useEffect(() => {

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
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUser(response.data.user);
        setMessage(response.data.message);

      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    const fetchLogs = async () => {
      try {

        const response = await axios.get(
          "http://localhost:5001/api/logs/recent"
        );

        const logs = response.data;
        setLoginLogs(logs);
        let newAlerts = [];
        const recentLogs = logs.slice(0, 5);
        const failedLogins = recentLogs.filter(
          log => log.status === "failed"
        );
        if (failedLogins.length >= 3) {
          newAlerts.push("Multiple failed login attempts detected");
        }
        const devices = [...new Set(logs.map(log => log.device))];
        if (devices.length > 1) {
          newAlerts.push("Login from new device detected");
        }
        const locations = [...new Set(logs.map(log => log.location))];
        if (locations.length > 1) {
          newAlerts.push("Login from new location detected");
        }
        setAlerts(newAlerts);
        setAcknowledged(false);

      } catch (error) {
        console.log("Error fetching logs");
      }
    };

    fetchProtected();
    fetchLogs();

  }, [navigate, token]);

  return (
    <div className="dashboard-container">

      {/* Welcome Header */}
      <div className="welcome-bar">
        <h2>
          Welcome back, {storedUser?.username}
        </h2>

        <div className="welcome-info">
          <span className="welcome-role">
            Role: {storedUser?.role || "User"}
          </span>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="statistics-section">

        <h2>Account Statistics</h2>

        <div className="stats-grid">

          <div className="stat-card">
            <h3>Total Logins</h3>
            <p className="stat-value">{totalLogins}</p>

            <div className="mini-graph">
              {dummyLoginData.map((count, index) => (
                <div
                  key={index}
                  className="mini-bar"
                  style={{ height: `${count * 10}px` }}
                />
              ))}
            </div>

            <p className="graph-label">Last 7 days (dummy)</p>
          </div>

          <div className="stat-card">
            <h3>Anomalous Logins</h3>
            <p className="stat-value">{totalAnomalous}</p>

            <div className="mini-graph">
              {dummyAnomalousData.map((count, index) => (
                <div
                  key={index}
                  className="mini-bar"
                  style={{ height: `${count * 20}px` }}
                />
              ))}
            </div>
          </div>

          <div className="stat-card">
            <h3>Last Login</h3>
            <p className="stat-value">
              {storedUser?.lastLogin
                ? new Date(storedUser.lastLogin).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div className="stat-card">
            <h3>Account Status</h3>
            <p className="stat-value">Active</p>
          </div>

        </div>

      </div>

      {/* Security Alerts */}

      {alerts.length > 0 && !acknowledged && (

        <div className="alerts-box">

          <h2> Security Alerts</h2>

          {alerts.map((alert, index) => (

            <div key={index} className="alert-item">
              {alert}
            </div>

          ))}
          <button
            className="ack-btn"
            onClick={() => setAcknowledged(true)}
          >
            Acknowledge
          </button>

        </div>

      )}

      {/* Recent Login Activity */}

      <div className="login-activity">

        <h2>Recent Login Activity</h2>

        <table className="login-table">

          <thead>
            <tr>
              <th>Email</th>
              <th>IP</th>
              <th>Device</th>
              <th>Location</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>

            {loginLogs.map((log) => (
              <tr key={log._id}>

                <td>{log.email}</td>

                <td>{log.ip}</td>

                <td>
                  {log.device?.includes("Chrome")
                    ? "Chrome (Windows)"
                    : log.device?.includes("Firefox")
                    ? "Firefox"
                    : log.device?.includes("Edg")
                    ? "Edge"
                    : "Browser"}
                </td>
                <td>{log.location || "Unknown"}</td>

                <td>
                  <span className={`log-status ${log.status}`}>
                    {log.status}
                  </span>
                </td>

                <td>
                  {new Date(log.timestamp).toLocaleString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dashboard;