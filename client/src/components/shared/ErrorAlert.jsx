import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

/**
 * A reusable error alert component that displays error messages with a retry option
 * 
 * @param {string} title - Optional title for the error message
 * @param {string} message - The error message to display
 * @param {Function} retryAction - Function to call when retry button is clicked
 * @param {string} retryText - Optional custom text for retry button
 */
export default function ErrorAlert({ title, message, retryAction, retryText = "Try Again" }) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-red-100">
      <div className="flex flex-col items-center text-center">
        <div className="bg-red-100 p-3 rounded-full mb-4">
          <FiAlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        {title && (
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        )}
        
        <p className="text-sm text-gray-600 mb-6 max-w-md">
          {message}
        </p>
        
        {retryAction && (
          <button
            onClick={retryAction}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FiRefreshCw className="mr-2 -ml-1 h-4 w-4" />
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}