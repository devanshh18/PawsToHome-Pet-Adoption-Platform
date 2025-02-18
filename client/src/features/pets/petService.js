import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/pets",
  withCredentials: true,
});

export const addPet = async (formData) => {
  try {
    // Debug: Log the FormData contents
    for (let pair of formData.entries()) {
      console.log("Sending to server:", pair[0], pair[1]);
    }

    const response = await API.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Backend error response:", error.response?.data);
    if (error.response?.data?.errors) {
      const errorMessages = error.response.data.errors
        .map((err) => `${err.field}: ${err.message}`)
        .join(", ");
      throw new Error(errorMessages);
    }
    throw new Error(error.response?.data?.message || "Failed to add pet");
  }
};

export const getShelterPets = async () => {
  const response = await API.get("/shelter-pets");
  return response.data;
};

export const updatePet = async (id, formData) => {
  const response = await API.put(`/${id}`, formData);
  return response.data;
};

export const deletePet = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};

export const searchPets = async (filters) => {
  const response = await API.get(`/search`, { params: filters });
  return response.data;
};

export const getPetById = async (id) => {
  const response = await API.get(`details/${id}`);
  return response.data;
};