import axios from "axios";

export const API = axios.create({
  baseURL: "https://paws-to-home-pet-adoption-platform.vercel.app/api/auth",
  withCredentials: true,
});

export const login = async (data) => {
  const response = await API.post("/login", data);
  return response.data;
};

export const logout = async () => {
  const response = await API.post("/logout");
  return response.data;
};

export const registerUser = async (data) => {
  const response = await API.post("/register/user", data);
  return response.data;
};

export const registerShelter = async (data) => {
  const response = await API.post("/register/shelter", data);
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await API.put("/update-profile", data);
  return response.data;
};
