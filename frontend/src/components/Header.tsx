import React from "react";

const Header = () => {
  return (
    <div className="flex items-center space-x-2">
      {/* Logo and Title Container */}
      <div className="flex items-center">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          CoCreate.io
        </span>
      </div>

      {/* Subtitle/Description */}
      <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-gray-700 mx-4" />
      <span className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
        Social Media Content Tool
      </span>
    </div>
  );
};

export default Header;
