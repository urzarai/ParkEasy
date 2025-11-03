import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export function getAuthHeaders(token) {
  return { headers: { Authorization: `Bearer ${token}` } };
}

export const api = {
  getBuildings: (token) => axios.get(`${BASE_URL}/buildings`, getAuthHeaders(token)),
  getSpotsByBuilding: (buildingId, token) => axios.get(`${BASE_URL}/spots/building/${buildingId}`, getAuthHeaders(token)),
  getReservationsByBuilding: (buildingId, token) =>
    axios.get(`${BASE_URL}/reservations/building/${buildingId}`, getAuthHeaders(token)),
  reserveSpot: (spotId, data, token) =>
    axios.post(`${BASE_URL}/reservations/spot/${spotId}`, data, getAuthHeaders(token)),
};
