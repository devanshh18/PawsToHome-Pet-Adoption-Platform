import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/adoptions`.replace(/\/\//g, '/') : "/api/adoptions",
  withCredentials: true,
});

export const submitAdoptionApplication = async (applicationData) => {
  const response = await API.post("/submit", applicationData);
  return response.data;
};

export const getShelterApplications = async () => {
  const response = await API.get("/shelter/applications");
  return response.data;
};

export const getUserApplications = async () => {
  const response = await API.get("/user");
  return response.data;
};

export const updateApplicationStatus = async (id, statusData) => {
  const response = await API.patch(`/${id}/status`, statusData);
  return response.data;
};