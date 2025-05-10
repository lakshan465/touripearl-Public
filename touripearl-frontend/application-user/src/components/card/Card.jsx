import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false, 
  bordered = true 
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm overflow-hidden';
  const hoverClasses = hoverable ? 'transition-all duration-300 hover:shadow-lg' : '';
  const borderClasses = bordered ? 'border border-gray-200' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${borderClasses} ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ 
  children, 
  className = '' 
}) => {
  return (
    <h3 className={`text-xl font-bold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

const CardContent = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

// Example usage of the Card component
const ExampleCard = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card hoverable>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This is an example card content. You can put any content here.
          </p>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Save
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

// Export all components
export { Card, CardHeader, CardTitle, CardContent, CardFooter, ExampleCard };
export default Card;