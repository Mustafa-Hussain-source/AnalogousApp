// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import "../styles/DashboardLayout.css";

// function DashboardLayout() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   return (
//     <div className="layout-container">
//       <aside className="sidebar">
//         <h2 className="logo">MyApp</h2>

//         <nav>
//           <NavLink
//             to="/dashboard"
//             className={({ isActive }) =>
//               isActive ? "sidebar-link active" : "sidebar-link"
//             }
//           >
//             Dashboard
//           </NavLink>

//           <NavLink
//             to="/profile"
//             className={({ isActive }) =>
//               isActive ? "sidebar-link active" : "sidebar-link"
//             }
//           >
//             Profile
//           </NavLink>

//           <NavLink
//             to="/settings"
//             className={({ isActive }) =>
//               isActive ? "sidebar-link active" : "sidebar-link"
//             }
//           >
//             Settings
//           </NavLink>

//           <button onClick={handleLogout} className="logout-btn">
//             Logout
//           </button>
//         </nav>

//       </aside>

//       <main className="main-content">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// export default DashboardLayout;

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../styles/DashboardLayout.css";

function DashboardLayout() {
  const navigate = useNavigate();

  // 🔥 Get role from localStorage
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <h2 className="logo">Anomalous Login Detection System</h2>

        <nav>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Settings
          </NavLink>

          {/* 🔐 ADMIN PANEL ONLY FOR ADMIN */}
          {role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              Admin Panel
            </NavLink>
          )}

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>

      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;