import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
      <div className="container mx-auto text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} <span className="text-blue-400 font-semibold">BlogApp</span>. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Built using MERN Stack
        </p>
      </div>
    </footer>
  );
};

export default Footer;
