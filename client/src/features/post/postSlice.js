import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "./postService";
import { toast } from "react-toastify";

export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      return await postService.getAllPosts(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchById",
  async (id, thunkAPI) => {
    try {
      return await postService.getPostById(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/create",
  async (postData, thunkAPI) => {
    try {
      return await postService.createPost(postData);
    } catch (error) {
      if (error?.errors) {
        return thunkAPI.rejectWithValue(error);
      }
      const message = error.message || "Failed to create post";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, postData }, thunkAPI) => {
    try {
      return await postService.updatePost(id, postData);
    } catch (error) {
      if (error?.errors) {
        return thunkAPI.rejectWithValue(error);
      }
      const message = error.message || "Failed to update post";
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (id, thunkAPI) => {
    try {
      return await postService.deletePost(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, comment }, thunkAPI) => {
    try {
      // The postService expects 'text', but we're receiving 'comment'
      return await postService.addComment(postId, comment);
    } catch (error) {
      if (error.response?.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      const message = error.message || "Failed to add comment";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async (id, thunkAPI) => {
    try {
      return await postService.toggleLike(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (_, thunkAPI) => {
    try {
      return await postService.getUserPosts();
    } catch (error) {
      const message = error.message || "Failed to fetch your posts";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  posts: [],
  userPosts: [],
  selectedPost: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  pagination: {
    total: 0,
    pages: 1,
    currentPage: 1,
  },
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    resetPostState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts;
        state.pagination = {
          total: action.payload.total,
          pages: action.payload.pages,
          currentPage: action.payload.currentPage,
        };
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPost = action.payload.post;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedPost = action.payload.post;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedPost = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedPost) {
          state.selectedPost.comments = action.payload.comments;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        if (state.selectedPost) {
          state.selectedPost.likes = action.payload.likes;
        }
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPosts = action.payload.posts;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetPostState, clearSelectedPost } = postSlice.actions;
export default postSlice.reducer;
