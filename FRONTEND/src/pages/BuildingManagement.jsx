import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

function BuildingManagement() {
  const { token } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", abbreviation: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const API_BASE = "http://localhost:5000/api";

  // Fetch buildings
  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/buildings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBuildings(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load buildings");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBuildings();
  }, [token]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!form.name || !form.abbreviation) {
      setError("Name and abbreviation are required");
      return;
    }
    try {
      if (editingId) {
        // Edit building
        await axios.put(`${API_BASE}/buildings/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Building updated successfully");
      } else {
        // Add building
        await axios.post(`${API_BASE}/buildings`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Building added successfully");
      }
      setForm({ name: "", abbreviation: "" });
      setEditingId(null);
      fetchBuildings();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error saving building");
    }
  };

  const onEdit = (building) => {
    setForm({ name: building.name, abbreviation: building.abbreviation });
    setEditingId(building._id);
    setMessage("");
    setError("");
  };

  const onDelete = async (id) => {
    setMessage("");
    try {
      await axios.delete(`${API_BASE}/buildings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Building deleted");
      fetchBuildings();
    } catch (err) {
      setError("Error deleting building");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Manage Buildings</h2>
      <form className="form" onSubmit={onSubmit}>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} required />
        <label>Abbreviation</label>
        <input
          name="abbreviation"
          value={form.abbreviation}
          onChange={onChange}
          required
        />
        <button className="btn" type="submit">
          {editingId ? "Update" : "Add"} Building
        </button>
        {editingId && (
          <button
            className="btn"
            type="button"
            onClick={() => {
              setForm({ name: "", abbreviation: "" });
              setEditingId(null);
              setError("");
              setMessage("");
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <h3>Existing Buildings</h3>
      {loading ? (
        <p>Loading buildings...</p>
      ) : buildings.length === 0 ? (
        <p>No buildings found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Abbreviation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buildings.map((b) => (
              <tr key={b._id}>
                <td>{b.name}</td>
                <td>{b.abbreviation}</td>
                <td>
                  <button className="btn" onClick={() => onEdit(b)}>
                    Edit
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this building?"
                        )
                      ) {
                        onDelete(b._id);
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
    </div>
  );
}

export default BuildingManagement;
