import { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import SpotCard from "./SpotCard.jsx";

function SpotDialog({ building, token, onClose }) {
    const [spots, setSpots] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        setError("");
        api
            .getSpotsByBuilding(building._id, token)
            .then((res) => {
                if (Array.isArray(res.data)) setSpots(res.data);
                else setSpots([]);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load spots.");
            });

        api
            .getReservationsByBuilding(building._id, token)
            .then((res) => {
                if (Array.isArray(res.data)) setReservations(res.data);
                else setReservations([]);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load reservations.");
            });
    }, [building._id, token]);

    if (error) {
        return (
            <div className="dialog-overlay">
                <div className="dialog">
                    <button className="btn close-btn" onClick={onClose}>
                        Close
                    </button>
                    <h2>{building.name} - Parking Spots</h2>
                    <p className="error">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dialog-overlay">
            <div className="dialog">
                <button className="btn close-btn" onClick={onClose}>
                    Close
                </button>
                <h2>{building.name} - Parking Spots</h2>
                {spots.length === 0 && <p>No parking spots available.</p>}
                <div className="spot-list">
                    {spots.map((spot) => (
                        <SpotCard
                            key={spot._id}
                            spot={spot}
                            reservations={reservations.filter((r) => r.spot && r.spot._id === spot._id)}
                            token={token}
                        />
                    ))}

                </div>
            </div>
        </div>
    );
}

export default SpotDialog;
