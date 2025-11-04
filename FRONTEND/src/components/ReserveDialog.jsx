import { useState } from "react";
import { api } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function ReserveDialog({ spotId, token, onClose }) {
  // Reservation allowed only for today. So from/to times should be Time only fields with today's date.

  // For simplicity, reserve between times as "HH:MM" string, then parse them to Dates today.

  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  const buildDateTime = (timeStr) => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(":");
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fromTime || !toTime) {
      setError("Both from and to times are required");
      return;
    }

    const from = buildDateTime(fromTime);
    const to = buildDateTime(toTime);

    if (to <= from) {
      setError("End time must be after start time");
      return;
    }

    try {
      await api.reserveSpot(spotId, { from, to }, token);
      // show reservation success and indicate that confirmation email was sent
      const userEmail = user?.email || "your email";
      setSuccess(`Reservation successful! A confirmation email was sent to ${userEmail}.`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Reservation failed");
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog reserve-dialog">
        <button className="btn close-btn" onClick={onClose}>
          Close
        </button>
        <h3>Reserve Spot</h3>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        {!success && (
          <form onSubmit={handleSubmit}>
            <label>From Time</label>
            <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} required />
            <label>To Time</label>
            <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} required />
            <button className="btn" type="submit">Reserve</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ReserveDialog;
