import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SubMenuItem = ({ item, collapsed, onNavigate,active }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasSubItems = Array.isArray(item.subItems);
  
    const handleClick = () => {
      if (hasSubItems) {
        setIsOpen(!isOpen);
      } else if (item.path) {
        onNavigate(item.path);
      }
    };
  
    return (
      <div className="w-full">
        <button
          onClick={handleClick}
          className={`w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors group ${active === item.name && 'bg-gray-600'}`}
        >
          <div className="flex items-center min-w-0">
            <item.icon className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-white" />
            {!collapsed && (
              <span className="ml-4 truncate text-sm">{item.name}</span>
            )}
          </div>
          {!collapsed && hasSubItems && (
            <div className="ml-2">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
        </button>
        
        {isOpen && !collapsed && hasSubItems && (
          <div className="bg-gray-900">
            {item.subItems.map((subItem) => (
              <button
                key={subItem.name}
                onClick={() => onNavigate(subItem.path)}
                className="w-full flex items-center p-3 pl-12 hover:bg-gray-700 
                           transition-colors text-sm text-gray-300 hover:text-white"
              >
                {subItem.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
export default SubMenuItem;