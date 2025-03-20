import axios from "axios";
import API_BASE_URL from "../../config/api.js";

// Configure axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Get admin dashboard statistics
export const getAdminStats = async () => {
  const response = await API.get("/admin/stats");
  return response.data;
};

// Get all users
export const getAllUsers = async () => {
  const response = await API.get("/admin/users");
  return response.data;
};

// Get all shelters
export const getAllShelters = async () => {
  const response = await API.get("/admin/shelters");
  return response.data;
};

// Get pending shelters
export const getPendingShelters = async () => {
  const response = await API.get("/admin/shelters/pending");
  return response.data;
};

// Approve shelter
export const approveShelter = async (id) => {
  const response = await API.patch(`/admin/shelters/${id}/approve`);
  return response.data;
};

// Reject shelter
export const rejectShelter = async (id, reason) => {
  const response = await API.patch(`/admin/shelters/${id}/reject`, { reason });
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await API.delete(`/admin/users/${id}`);
  return response.data;
};

// Delete shelter
export const deleteShelter = async (id) => {
  const response = await API.delete(`/admin/shelters/${id}`);
  return response.data;
};

// Get system health data
export const getSystemHealth = async () => {
  const response = await API.get("/admin/system-health");
  return response.data;
};

// Get system history data
export const getSystemHistory = async (period) => {
  const response = await API.get(`/admin/system-history/${period}`);
  return response.data;
};

// Get insights data
export const getInsights = async (timeRange) => {
  const response = await API.get(`/admin/insights?timeRange=${timeRange}`);
  return response.data;
};

// Generate report
export const generateReport = async (type, filters) => {
  const queryParams = new URLSearchParams({ type });
  if (filters?.timeRange) {
    queryParams.append("timeRange", filters.timeRange || "all");
  }

  const response = await API.get(`/admin/reports/generate?${queryParams}`, {
    responseType: "blob",
  });

  return response;
};

export default {
  getAdminStats,
  getAllUsers,
  getAllShelters,
  getPendingShelters,
  approveShelter,
  rejectShelter,
  deleteUser,
  deleteShelter,
  getSystemHealth,
  getSystemHistory,
  getInsights,
  generateReport,
};
