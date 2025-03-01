import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  FiHeart,
  FiMessageSquare,
  FiChevronRight,
  FiTag,
  FiUser,
  FiCalendar,
} from 'react-icons/fi';

const PostCard = ({ post }) => {
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

  // Format date as "X time ago"
  const timeAgo = post.createdAt ? 
    formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 
    'recently';

  // Strip HTML from content for preview
  const contentPreview = post.content
    ? post.content.replace(/<[^>]*>/g, '').slice(0, 150) + (post.content.length > 150 ? '...' : '')
    : '';

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Post Image */}
      {post.photos && post.photos.length > 0 && (
        <Link to={`/post/${post._id}`} className="block h-60 overflow-hidden">
          <img
            src={post.photos[0]}
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </Link>
      )}

      {/* Post Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {/* Category Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[post.category]}`}>
            {categoryLabels[post.category]}
          </span>
          
          {/* Posted Date */}
          <div className="flex items-center text-gray-500 text-xs">
            <FiCalendar className="mr-1 h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
        
        {/* Title */}
        <Link to={`/post/${post._id}`} className="block">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
        </Link>
        
        {/* Content Preview */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {contentPreview}
        </p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                <FiTag className="mr-1" size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Author */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <FiUser className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-gray-700">By </span>
          <span className="font-medium text-gray-900">{post.author?.name || "Anonymous"}</span>
        </div>
        
        {/* Interactions */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-500">
              <FiHeart className="h-4 w-4" />
              <span className="text-xs">{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <FiMessageSquare className="h-4 w-4" />
              <span className="text-xs">{post.comments?.length || 0}</span>
            </div>
          </div>
          
          <Link 
            to={`/post/${post._id}`} 
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            Read more <FiChevronRight className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;