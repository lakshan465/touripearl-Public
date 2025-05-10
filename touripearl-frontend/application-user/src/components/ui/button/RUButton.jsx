import React from 'react';

const Button = ({ 
  onClick, 
  children, 
  type = 'primary', 
  className = '', 
  title = '',
  disabled = false 
}) => {
  // Type variants
  const typeVariants = {
    primary: {
      bg: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-blue-500/20',
      text: 'text-white'
    },
    success: {
      bg: 'bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-green-500/20',
      text: 'text-white'
    },
    warn: {
      bg: 'bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-red-500/20',
      text: 'text-white'
    },
    secondary: {
      bg: 'bg-gray-500 hover:bg-gray-600 active:bg-gray-700 shadow-gray-500/20',
      text: 'text-white'
    }
  };

  // Get selected type variant or default to primary
  const variant = typeVariants[type] || typeVariants.primary;

  return (
    <button
      onClick={onClick}
      className={`
        h-11 px-6 rounded-xl 
        ${variant.bg} 
        ${variant.text}
        shadow-lg
        transition-all duration-200 ease-in-out
        font-medium
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
