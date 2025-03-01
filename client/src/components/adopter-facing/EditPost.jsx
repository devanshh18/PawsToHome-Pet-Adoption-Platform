import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  updatePost,
  clearSelectedPost,
} from "../../features/post/postSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../shared/LoadingSpinner";
import {
  FiImage,
  FiX,
  FiPlus,
  FiArrowLeft,
  FiSave,
  FiTag,
} from "react-icons/fi";
import RichTextEditor from "./RichTextEditor";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedPost, isLoading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [permissionChecked, setPermissionChecked] = useState(false);


  const categories = [
    { value: "general", label: "General" },
    { value: "adoption_story", label: "Adoption Story" },
    { value: "pet_care", label: "Pet Care" },
    { value: "training", label: "Training" },
  ];

  // Fetch post data and populate form
  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      try {
        await dispatch(fetchPostById(id)).unwrap();
      } catch (error) {
        toast.error(
          "Failed to load post. It may have been deleted or you don't have permission."
        );
        navigate("/posts");
      } finally {
        setInitialLoading(false);
      }
    };

    loadPost();

    // Clear selected post when component unmounts
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, id, navigate]);

  // Populate form when post data is loaded
  useEffect(() => {
    if (selectedPost && user && !permissionChecked) {
      // Check if user is author
      if (user._id !== selectedPost.author?._id) {
        toast.error("You don't have permission to edit this post");
        navigate(`/post/${id}`);
        return;
      }
      
      // Mark permission as checked so we don't check again
      setPermissionChecked(true);
      
      // Only set form values if user is the author
      setTitle(selectedPost.title || "");
      setContent(selectedPost.content || "");
      setCategory(selectedPost.category || "general");
      setTags(selectedPost.tags || []);
  
      // Set existing photos
      if (selectedPost.photos && selectedPost.photos.length > 0) {
        setExistingPhotos(selectedPost.photos);
      }
    }
  }, [selectedPost, user, id, navigate, permissionChecked]);

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file count (existing + new photos) - Backend allows up to 10 photos
    if (files.length + photos.length + existingPhotos.length > 10) {
      toast.error("Maximum 10 photos allowed");
      return;
    }

    // Validate file type and size
    const validFiles = files.filter((file) => {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        toast.error(`${file.name} is not a supported image format`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        // Changed to 10MB to match backend
        toast.error(`${file.name} exceeds 10MB size limit`);
        return false;
      }
      return true;
    });

    // Update photos state
    setPhotos((prevPhotos) => [...prevPhotos, ...validFiles]);

    // Generate previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove a new photo from selection
  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  // Remove an existing photo
  const removeExistingPhoto = (index) => {
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
  };

  // Handle adding a tag
  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    } else if (tags.includes(trimmedTag)) {
      toast.error("Tag already added");
    } else if (tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    else if (title.length > 50)
      // Server has 50 char limit
      newErrors.title = "Title must be less than 50 characters";

    if (!content.trim()) newErrors.content = "Content is required";
    if (
      content === "<p></p>" ||
      content === "<p><br></p>" ||
      content === "" ||
      content.replace(/<[^>]*>/g, "").trim() === ""
    ) {
      newErrors.content = "Content is required";
    }

    // Need at least one photo (either existing or new)
    if (existingPhotos.length === 0 && photos.length === 0) {
      newErrors.photos = "At least one photo is required";
    }

    // Check the total photo count
    if (existingPhotos.length + photos.length > 10) {
      // Server allows up to 10 photos
      newErrors.photos = "Maximum 10 photos allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content);
      formData.append("category", category);

      if (tags.length > 0) {
        formData.append("tags", tags.join(","));
      }

      // Handle existing photos
      if (existingPhotos.length > 0) {
        existingPhotos.forEach((photoUrl, index) => {
          formData.append(`existingPhotos[${index}]`, photoUrl);
        });
      }
      // Append new photos if any
      photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      await dispatch(updatePost({ id, postData: formData })).unwrap();
      toast.success("Post updated successfully!");
      navigate(`/post/${id}`);
    } catch (error) {
      console.error("Failed to update post:", error);

      // Enhanced error handling
      if (error?.errors && Array.isArray(error.errors)) {
        const serverErrors = {};

        // Map server errors to form fields
        error.errors.forEach((err) => {
          serverErrors[err.field] = err.message;
          console.log(`Server validation error: ${err.field} - ${err.message}`);
        });

        setErrors((prev) => ({ ...prev, ...serverErrors }));

        // Show the first error in toast
        if (error.errors.length > 0) {
          toast.error(error.errors[0].message);
        } else {
          toast.error("Validation failed. Please check your inputs.");
        }
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update post. Please try again.");
      }
    }
  };

  if (initialLoading || (isLoading && !selectedPost)) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/post/${id}`)}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to post
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
          <p className="mt-2 text-gray-600">
            Update your post content, images, or tags
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a title"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Category Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`rounded-lg py-3 px-4 text-center transition-all ${
                      category === cat.value
                        ? "bg-blue-100 border-2 border-blue-500 text-blue-800 shadow-sm"
                        : "bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <span className="text-xs text-gray-500">
                  Use the toolbar to format your post
                </span>
              </div>
              <div
                className={`${
                  errors.content ? "border-2 border-red-400 rounded-lg" : ""
                }`}
              >
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your post content here..."
                  // className="h-64 mb-12 bg-white"
                />
              </div>
              {errors.content && (
                <p className="mt-2 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags{" "}
                <span className="text-gray-500 font-normal">
                  (optional, max 5)
                </span>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1.5 rounded-full text-gray-700 text-sm flex items-center"
                  >
                    <FiTag className="mr-1.5 text-gray-500" size={14} />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Photos{" "}
                <span className="text-gray-500 font-normal">
                  (1-10 photos, max 10MB each)
                </span>
              </label>

              {/* Current photos */}
              {existingPhotos.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Current Photos ({existingPhotos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingPhotos.map((src, index) => (
                      <div key={index} className="relative group">
                        <div className="overflow-hidden rounded-lg h-32 bg-gray-100">
                          <img
                            src={src}
                            alt={`Current ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(index)}
                          className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-red-100 transition-colors"
                        >
                          <FiX size={16} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload new photos */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 ${
                  errors.photos
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 hover:border-blue-400 bg-gray-50"
                }`}
              >
                <div className="flex justify-center">
                  <label className="cursor-pointer">
                    <div className="text-center py-8">
                      <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag photos here or click to upload
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or JPEG up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {errors.photos && (
                <p className="mt-2 text-sm text-red-600">{errors.photos}</p>
              )}

              {/* New photo previews */}
              {photoPreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    New Photos to Add ({photoPreviews.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photoPreviews.map((src, index) => (
                      <div key={index} className="relative group">
                        <div className="overflow-hidden rounded-lg h-32 bg-gray-100">
                          <img
                            src={src}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-red-100 transition-colors"
                        >
                          <FiX size={16} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-4 text-sm text-gray-500">
                Total photos: {existingPhotos.length + photoPreviews.length}/10
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(`/post/${id}`)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                <FiSave size={18} /> Update Post
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
