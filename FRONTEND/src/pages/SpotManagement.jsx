import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

function SpotManagement() {
  const { token } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ spotNumber: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const API_BASE = "http://localhost:5000/api";

  // Fetch buildings for dropdown
  const fetchBuildings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/buildings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBuildings(res.data);
    } catch {
      setError("Failed to load buildings");
    }
  };

  // Fetch spots for selected building
  const fetchSpots = async (buildingId) => {
    if (!buildingId) {
      setSpots([]);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/spots/building/${buildingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpots(res.data);
      setError("");
    } catch {
      setError("Failed to load spots");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBuildings();
  }, [token]);

  useEffect(() => {
    fetchSpots(selectedBuildingId);
  }, [selectedBuildingId]);

  const onChangeForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!form.spotNumber || !selectedBuildingId) {
      setError("Spot number and building are required");
      return;
    }
    try {
      if (editingId) {
        // No API for spot edit in backend code given, so skip or implement patch here if available
        setError("Spot editing not implemented (backend missing)");
        return;
      } else {
        // Add spot
        await axios.post(`${API_BASE}/spots/building/${selectedBuildingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Spot added successfully");
      }
      setForm({ spotNumber: "" });
      fetchSpots(selectedBuildingId);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error saving spot");
    }
  };

  const onDelete = async (id) => {
    setMessage("");
    try {
      await axios.delete(`${API_BASE}/spots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Spot deleted");
      fetchSpots(selectedBuildingId);
    } catch (err) {
      setError("Error deleting spot");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Manage Spots</h2>
      <div>
        <label>Select Building</label>
        <select
          value={selectedBuildingId}
          onChange={(e) => setSelectedBuildingId(e.target.value)}
        >
          <option value="">-- Select Building --</option>
          {buildings.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      {selectedBuildingId && (
        <>
          <form className="form" onSubmit={onSubmit}>
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
            <label>Spot Number</label>
            <input
              name="spotNumber"
              value={form.spotNumber}
              onChange={onChangeForm}
              required
            />
            <button className="btn" type="submit">
              Add Spot
            </button>
          </form>
          <h3>Spots in this Building</h3>
          {loading ? (
            <p>Loading spots...</p>
          ) : spots.length === 0 ? (
            <p>No spots found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Spot Number</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {spots.map((spot) => (
                  <tr key={spot._id}>
                    <td>{spot.spotNumber}</td>
                    <td>
                      {/* Edit not available since backend route missing */}
                      {/* <button className="btn" onClick={() => onEdit(spot)}>Edit</button> */}
                      <button
                        className="btn"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this spot?"
                            )
                          ) {
                            onDelete(spot._id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default SpotManagement;
