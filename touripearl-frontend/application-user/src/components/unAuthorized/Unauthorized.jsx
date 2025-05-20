import React from 'react';
import { ShieldX, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="flex justify-center mb-6">
          <ShieldX className="h-24 w-24 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Sorry, you don't have permission to access this page. Please contact your administrator if you think this is a mistake.
        </p>
        
        <button
          onClick={handleGoBack}
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;