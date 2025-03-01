import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFilter, FiX, FiTag, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import LoadingSpinner from '../shared/LoadingSpinner';
import PostCard from './PostCard';

const PostList = ({
  posts,
  totalPosts,
  currentPage,
  totalPages,
  onPageChange,
  category,
  onCategoryChange,
  tag,
  onTagChange,
  allTags,
  isLoading
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  
  const categories = [
    { value: "", label: "All Categories" },
    { value: "adoption_story", label: "Adoption Stories" },
    { value: "pet_care", label: "Pet Care" },
    { value: "training", label: "Training" },
    { value: "general", label: "General" },
  ];

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic for many pages
      if (currentPage <= 3) {
        // Current page is near the start
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Current page is near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Current page is in the middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden w-full">
          <button 
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              <span className="font-medium text-gray-700">Filter Posts</span>
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {category || tag ? 'Active' : 'None'}
            </span>
          </button>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-4">
          {/* Category Filter */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Category:</span>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FiChevronRight className="rotate-90 h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Tag Filter - only show if we have tags */}
          {allTags.length > 0 && (
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Tag:</span>
              <div className="relative">
                <select
                  value={tag}
                  onChange={(e) => onTagChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Tags</option>
                  {allTags.map((tagOption) => (
                    <option key={tagOption} value={tagOption}>
                      {tagOption}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronRight className="rotate-90 h-4 w-4" />
                </div>
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(category || tag) && (
            <button
              onClick={() => {
                onCategoryChange('');
                onTagChange('');
              }}
              className="text-sm flex items-center text-gray-500 hover:text-blue-600"
            >
              <FiX className="mr-1" /> Clear filters
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500 ml-auto">
          {totalPosts === 0 ? 'No posts found' : 
            `Showing ${totalPosts} ${totalPosts === 1 ? 'post' : 'posts'}`}
        </div>
      </div>

      {/* Mobile Filters Dropdown */}
      {showMobileFilter && (
        <div className="md:hidden bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {allTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag
                </label>
                <select
                  value={tag}
                  onChange={(e) => onTagChange(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Tags</option>
                  {allTags.map((tagOption) => (
                    <option key={tagOption} value={tagOption}>
                      {tagOption}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(category || tag) && (
              <button
                onClick={() => {
                  onCategoryChange('');
                  onTagChange('');
                }}
                className="w-full text-sm flex items-center justify-center text-gray-700 hover:text-blue-600 py-2 border border-gray-300 rounded-lg hover:border-blue-300"
              >
                <FiX className="mr-2" /> Clear filters
              </button>
            )}

            <button
              onClick={() => setShowMobileFilter(false)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100 my-8">
          <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FiTag className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No posts found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {category || tag 
              ? "We couldn't find any posts matching your filters. Try adjusting your criteria or check back later."
              : "There are no posts available at the moment. Check back later or be the first to share something!"}
          </p>
          {(category || tag) && (
            <button
              onClick={() => {
                onCategoryChange('');
                onTagChange('');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Post Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronLeft />
                </button>

                {getPageNumbers().map((page, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (typeof page === 'number') onPageChange(page);
                    }}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : page === '...'
                        ? "text-gray-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronRight />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostList;