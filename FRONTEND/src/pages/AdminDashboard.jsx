import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header>
        <h1>Admin Dashboard</h1>
        <button className="btn logout" onClick={logout}>
          Logout
        </button>
      </header>
      <div className="building-list" style={{ justifyContent: "center" }}>
        <div
          className="card building-card"
          style={{ width: "200px", cursor: "pointer" }}
          onClick={() => navigate("/admin/buildings")}
        >
          <h3>Buildings</h3>
          <p>Create / Edit / Delete Buildings</p>
        </div>
        <div
          className="card building-card"
          style={{ width: "200px", cursor: "pointer" }}
          onClick={() => navigate("/admin/spots")}
        >
          <h3>Spots</h3>
          <p>Create / Edit / Delete Parking Spots</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
