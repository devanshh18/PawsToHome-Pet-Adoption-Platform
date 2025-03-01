import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../../features/post/postSlice";
import PostList from "../../components/adopter-facing/PostList";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

function Posts() {
  const dispatch = useDispatch();
  const { posts, isLoading, pagination } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [allTags, setAllTags] = useState([]);

  // Extract unique tags from posts for filtering
  useEffect(() => {
    if (posts && posts.length > 0) {
      const tags = new Set();
      posts.forEach((post) => {
        if (post.tags && post.tags.length > 0) {
          post.tags.forEach((tag) => tags.add(tag));
        }
      });
      setAllTags(Array.from(tags));
    }
  }, [posts]);

  // Fetch posts when component mounts or filters change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 9,
    };

    if (selectedCategory) {
      params.category = selectedCategory;
    }

    if (selectedTag) {
      params.tag = selectedTag;
    }

    dispatch(fetchAllPosts(params));
  }, [dispatch, currentPage, selectedCategory, selectedTag]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleTagChange = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-14.5 px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Header Text */}
            <h1 className="text-4xl font-bold text-white mb-3">Pet Community</h1>
            <p className="text-xl text-blue-100 mb-6">
              Discover stories, tips, and experiences from our pet-loving community
            </p>
          
          {/* Main Content - Moved into header */}
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-4xl shadow-lg px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-5">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    Latest Posts
                  </h2>
                  <p className="text-gray-600">
                    Learn and share pet care knowledge with fellow animal lovers
                  </p>
                </div>

                {user && (
                  <Link
                    to="/add-post"
                    className="flex-shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-3xl font-medium transition-colors whitespace-nowrap shadow-sm"
                  >
                    <FiPlus className="h-5 w-5" />
                    Share Your Story
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post List Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <PostList
          posts={posts}
          totalPosts={pagination?.total || 0}
          currentPage={currentPage}
          totalPages={pagination?.pages || 1}
          onPageChange={handlePageChange}
          category={selectedCategory}
          onCategoryChange={handleCategoryChange}
          tag={selectedTag}
          onTagChange={handleTagChange}
          allTags={allTags}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default Posts;