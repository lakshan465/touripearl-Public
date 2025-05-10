import React from 'react';
import { ServerCrash, RefreshCcw } from 'lucide-react';

const ServerError = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-lg">
        <div className="flex justify-center mb-6">
          <ServerCrash className="h-24 w-24 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Server Not Responding
        </h1>
        
        <p className="text-lg text-gray-600 mb-4">
          We're having trouble connecting to our servers. This might be due to:
        </p>
        
        <ul className="text-left text-gray-600 mb-8 space-y-2 mx-auto max-w-md">
          <li className="flex items-start">
            <span className="font-medium">• Server maintenance</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium">• High traffic volume</span>
          </li>
          <li className="flex items-start">
            <span className="font-medium">• Temporary network issues</span>
          </li>
        </ul>
        
        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Try Again
          </button>
          
          <p className="text-sm text-gray-500">
            If the problem persists, please try again later or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;