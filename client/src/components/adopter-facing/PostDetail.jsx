import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  addComment,
  toggleLike,
  deletePost,
} from "../../features/post/postSlice";
import {
  FiArrowLeft,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiMoreVertical,
  FiTrash2,
  FiEdit,
  FiTag,
  FiUser,
  FiCalendar,
  FiSend,
} from "react-icons/fi";
import { toast } from "react-toastify";
import LoadingSpinner from "../shared/LoadingSpinner";
import { formatDistanceToNow } from "date-fns";
import DOMPurify from "dompurify";

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedPost, isLoading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageViewMode, setImageViewMode] = useState("contain"); // 'contain' or 'cover'

  // Category styling
  const categoryColors = {
    adoption_story: "bg-green-100 text-green-800",
    pet_care: "bg-blue-100 text-blue-800",
    training: "bg-purple-100 text-purple-800",
    general: "bg-gray-100 text-gray-800",
  };

  const categoryLabels = {
    adoption_story: "Adoption Story",
    pet_care: "Pet Care",
    training: "Training",
    general: "General",
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (comment.trim().length > 500) {
      // Backend limits comment length to 500 chars
      toast.error("Comment must be less than 500 characters");
      return;
    }

    try {
      await dispatch(
        addComment({
          postId: id,
          comment: comment.trim(), // Backend expects 'text', but our action will handle this
        })
      ).unwrap();
      setComment("");
    } catch (error) {
      // Enhanced error handling
      if (error?.errors && Array.isArray(error.errors)) {
        toast.error(error.errors[0].message || "Failed to add comment");
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add comment");
      }
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("You must be logged in to like posts");
      return;
    }

    try {
      await dispatch(toggleLike(id)).unwrap();
    } catch (error) {
      toast.error("Failed to update like status");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await dispatch(deletePost(id)).unwrap();
      navigate("/posts");
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedPost.title,
        text: `Check out this post: ${selectedPost.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard!");
    }
  };

  const nextImage = () => {
    if (selectedPost?.photos?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === selectedPost.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedPost?.photos?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedPost.photos.length - 1 : prev - 1
      );
    }
  };

  const isAuthor = user && selectedPost && user._id === selectedPost.author._id;
  const isLiked = user && selectedPost?.likes?.includes(user._id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/posts"
            className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiArrowLeft className="mr-2" /> Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/posts")}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to posts
          </button>
        </div>

        {/* Post card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          {/* Post header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      categoryColors[selectedPost.category]
                    }`}
                  >
                    {categoryLabels[selectedPost.category]}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center">
                    <FiCalendar className="mr-1 h-3.5 w-3.5" />
                    {formatDistanceToNow(new Date(selectedPost.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {selectedPost.title}
                </h1>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FiUser className="text-gray-500" />
                    <span className="font-medium text-gray-800">
                      {selectedPost.author?.name || "Anonymous"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post actions */}
              {isAuthor && (
                <div className="relative">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiMoreVertical className="text-gray-500" />
                  </button>

                  {showOptions && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 w-40 z-10">
                      <Link
                        to={`/edit-post/${selectedPost._id}`}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        <FiEdit className="text-gray-500" />
                        <span>Edit Post</span>
                      </Link>
                      <button
                        onClick={handleDeletePost}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600 w-full text-left"
                      >
                        <FiTrash2 className="text-red-500" />
                        <span>Delete Post</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Post images */}
          {selectedPost.photos && selectedPost.photos.length > 0 && (
            <div className="relative">
              {/* Background effect for visual appeal */}
              <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>

              {/* Main image container with enhanced styling */}
              <div className="relative h-[450px] bg-gray-900 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPost.photos[currentImageIndex]}
                  alt={selectedPost.title}
                  className={`w-full h-full object-${imageViewMode} transition-all duration-300`}
                />

                {/* Toggle view mode button */}
                <button
                  onClick={() =>
                    setImageViewMode(
                      imageViewMode === "contain" ? "cover" : "contain"
                    )
                  }
                  className="absolute bottom-4 right-16 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10 flex items-center justify-center"
                  title={
                    imageViewMode === "contain"
                      ? "Switch to fill mode"
                      : "Switch to fit mode"
                  }
                >
                  {imageViewMode === "contain" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="2" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="2" />
                      <rect x="7" y="7" width="10" height="10" rx="1" />
                    </svg>
                  )}
                </button>

                {/* Full screen button (optional) */}
                <button
                  onClick={() => {
                    // You can implement a full-screen mode here
                    const img = document.createElement("img");
                    img.src = selectedPost.photos[currentImageIndex];
                    img.style.objectFit = "contain";
                    const fullscreen = document.createElement("div");
                    fullscreen.style =
                      "position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;";
                    fullscreen.appendChild(img);
                    fullscreen.addEventListener("click", () =>
                      document.body.removeChild(fullscreen)
                    );
                    document.body.appendChild(fullscreen);
                  }}
                  className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-10 flex items-center justify-center"
                  title="Full screen"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </button>

                {/* Image count indicator */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
                  {currentImageIndex + 1} / {selectedPost.photos.length}
                </div>
              </div>

              {selectedPost.photos.length > 1 && (
                <>
                  {/* Image navigation arrows with enhanced styling */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <FiArrowLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <FiArrowLeft className="rotate-180" />
                  </button>

                  {/* Enhanced image pagination dots */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {selectedPost.photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Post content */}
          <div className="p-6 md:p-8">
            {/* Tags */}
            {selectedPost.tags && selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600"
                  >
                    <FiTag className="mr-1.5" size={14} />
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Post content */}
            <article className="prose max-w-none prose-blue mb-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(selectedPost.content),
                }}
              />
            </article>

            {/* Post interaction footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-2 ${
                    isLiked
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <FiHeart
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{selectedPost.likes?.length || 0}</span>
                </button>

                <button
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-600"
                  onClick={() =>
                    document.getElementById("comment-input").focus()
                  }
                >
                  <FiMessageSquare className="h-5 w-5" />
                  <span>{selectedPost.comments?.length || 0}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-600"
                >
                  <FiShare2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Comments ({selectedPost.comments?.length || 0})
          </h3>

          {/* Comment form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FiUser className="text-blue-600" />
              </div>
              <div className="flex-1 relative">
                <input
                  id="comment-input"
                  type="text"
                  placeholder={user ? "Write a comment..." : "Login to comment"}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={!user}
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  maxLength={500} // Add this to limit length
                />
                <button
                  type="submit"
                  disabled={!user || !comment.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 disabled:text-gray-300"
                >
                  <FiSend />
                </button>
              </div>
            </div>
            {comment.length > 400 && (
              <div className="text-right text-xs mt-1 text-gray-500">
                {comment.length}/500 characters
              </div>
            )}
          </form>

          {/* Comments list */}
          {selectedPost.comments && selectedPost.comments.length > 0 ? (
            <div className="space-y-6">
              {selectedPost.comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FiUser className="text-blue-600" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-800">
                        {comment.user?.name || "Anonymous"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiMessageSquare className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

        {/* Return to all posts */}
        <div className="text-center">
          <Link
            to="/posts"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiArrowLeft className="mr-2" /> Browse all posts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
