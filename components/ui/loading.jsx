import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

export const LoadingCard = () => (
  <div className="border-2 border-teal-200 rounded-xl p-4 bg-white/80 backdrop-blur-sm animate-pulse">
    <div className="h-4 bg-gradient-to-r from-blue-200 to-green-200 rounded mb-2"></div>
    <div className="h-3 bg-gradient-to-r from-green-200 to-blue-200 rounded w-3/4 mb-4"></div>
    <div className="flex justify-between">
      <div className="h-8 bg-gradient-to-r from-blue-200 to-green-200 rounded w-20"></div>
      <div className="h-8 bg-gradient-to-r from-green-200 to-blue-200 rounded w-16"></div>
    </div>
  </div>
);

export const LoadingPage = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4 text-blue-500" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  </div>
);