import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Admin.css";

function Admin() {

  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/protected/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.log("Error fetching users");
    }
  };

  const disableUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/protected/admin/disable/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchUsers();
    } catch (error) {
      console.log("Error disabling user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  {user.status === "active" ? (
                    <button
                      className="disable-btn"
                      onClick={() => disableUser(user._id)}
                    >
                      Disable
                    </button>
                  ) : (
                    <span className="disabled-text">Disabled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Admin;