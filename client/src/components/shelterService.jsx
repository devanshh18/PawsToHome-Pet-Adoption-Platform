import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/pets",
  withCredentials: true,
});

export const addPet = async (data) => {
  const response = await API.post("/", data);
  return response.data;
};

export const getShelterPets = async () => {
  const response = await API.get("/shelter-pets");
  return response.data;
};

export const updatePet = async (id, data) => {
  const response = await API.put(`/${id}`, data);
  return response.data;
};

export const deletePet = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};