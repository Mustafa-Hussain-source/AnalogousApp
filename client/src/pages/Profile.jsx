import { useEffect, useState } from "react";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        <h2>{user.username}</h2>

        <div className="profile-info">
          <div className="info-item">
            <span className="label">Email</span>
            <span>{user.email}</span>
          </div>

          <div className="info-item">
            <span className="label">User ID</span>
            <span className="user-id">{user.id}</span>
          </div>
        </div>

        <button className="edit-btn">Edit Profile</button>
      </div>
    </div>
  );
}

export default Profile;
