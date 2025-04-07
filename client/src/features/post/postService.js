import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';

const API = axios.create({
  baseURL: baseUrl ? `${baseUrl}/api/posts` : "/api/posts",
  withCredentials: true,
});

// Get all posts with filters
const getAllPosts = async (params = {}) => {
  try {
    const { page = 1, limit = 10, category, tag } = params;

    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (category) queryParams.append("category", category);
    if (tag) queryParams.append("tag", tag);

    const response = await API.get(`/?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

// Get single post by ID
const getPostById = async (id) => {
  try {
    const response = await API.get(`/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

// Create a new post
const createPost = async (postData) => {
  try {
    // For debugging: log some info about what we're sending
    console.log("Sending post data with keys:", [...postData.keys()]);

    // If postData is a FormData, send it directly
    const response = await API.post("/", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    // Extract the detailed error from the response
    if (error.response && error.response.data) {
      console.error("Server returned error:", error.response.data);
      throw error.response.data;
    }
    throw error;
  }
};

// Update an existing post
const updatePost = async (id, postData) => {
  try {
    console.log("Updating post with ID:", id);
    console.log("Update data contains keys:", [...postData.keys()]);

    const response = await API.put(`/${id}`, postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

// Delete a post
const deletePost = async (id) => {
  try {
    const response = await API.delete(`/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

// Add a comment to a post
const addComment = async (postId, comment) => {
  try {
    // Backend expects "text" instead of "content" for comments
    const response = await API.post(`/${postId}/comments`, { text: comment });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

// Toggle like on a post
const toggleLike = async (postId) => {
  try {
    const response = await API.post(`/${postId}/like`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

// Get user posts
const getUserPosts = async () => {
  try {
    const response = await API.get("/user");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

const postService = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  toggleLike,
  getUserPosts,
};

export default postService;
