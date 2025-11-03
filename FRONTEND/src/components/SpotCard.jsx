import { useState } from "react";
import ReserveDialog from "./ReserveDialog.jsx";

function SpotCard({ spot, reservations, token }) {
  const [showReserve, setShowReserve] = useState(false);

  return (
    <div className="card spot-card">
      <h4>Spot: {spot.spotNumber}</h4>
      <div>
        <strong>Reservations:</strong>
        {reservations.length === 0 && <p>No reservations</p>}
        <ul>
          {reservations.map((r) => (
            <li key={r._id}>
              {r.user.name} -{" "}
              {new Date(r.from).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
              to{" "}
              {new Date(r.to).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </li>
          ))}
        </ul>
      </div>
      <button className="btn reserve-btn" onClick={() => setShowReserve(true)}>
        Reserve Spot
      </button>
      {showReserve && (
        <ReserveDialog spotId={spot._id} token={token} onClose={() => setShowReserve(false)} />
      )}
    </div>
  );
}

export default SpotCard;
