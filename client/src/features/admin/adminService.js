import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
  withCredentials: true, // Enable sending cookies with requests
});

export const getPendingShelters = async () => {
  const response = await API.get("/shelters/pending");
  return response.data;
};

export const approveShelter = async (id) => {
  const response = await API.patch(`/shelters/approve/${id}`);
  return response.data;
};

export const rejectShelter = async (id, reason) => {
  const response = await API.patch(`/shelters/reject/${id}`, { reason });
  return response.data;
};