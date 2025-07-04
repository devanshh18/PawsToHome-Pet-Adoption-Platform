import axios from "axios";

const API = axios.create({
  baseURL: "https://paws-to-home-pet-adoption-platform.vercel.app/api/shelters",
  withCredentials: true,
});

// Get all shelters with optional filters
export const getAllShelters = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters.city) queryParams.append("city", filters.city);
    if (filters.state) queryParams.append("state", filters.state);

    if (filters.page) {
      queryParams.append("page", filters.page);
    }

    if (filters.limit) {
      queryParams.append("limit", filters.limit);
    }

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";
    const response = await API.get(`/${queryString}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch shelters";
    throw new Error(errorMessage);
  }
};

// Get shelter by ID
export const getShelterById = async (id) => {
  try {
    const response = await API.get(`/${id}`);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch shelter details";
    throw new Error(errorMessage);
  }
};
