import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../utils/api.js";
import BuildingCard from "../components/BuildingCard.jsx";
import SpotDialog from "../components/SpotDialog.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";

function Dashboard() {
  const { user, token, logout } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  useEffect(() => {
    if (token) {
      api
        .getBuildings(token)
        .then((res) => setBuildings(res.data))
        .catch((err) => console.error(err));
    }
  }, [token]);

  const onBuildingClick = (building) => {
    setSelectedBuilding(building);
  };

  const closeDialog = () => setSelectedBuilding(null);

  return (
    <div className="dashboard-container">
      <header>
        <h1>Welcome, {user?.name}</h1>
        <button className="btn logout" onClick={logout}>
          Logout
        </button>
      </header>
      <h2>Your Buildings</h2>
      <div className="building-list">
        {buildings.map((b) => (
          <BuildingCard key={b._id} building={b} onClick={onBuildingClick} />
        ))}
      </div>
      {selectedBuilding && (
        <ErrorBoundary>
          <SpotDialog
            building={selectedBuilding}
            token={token}
            onClose={closeDialog}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}

export default Dashboard;
