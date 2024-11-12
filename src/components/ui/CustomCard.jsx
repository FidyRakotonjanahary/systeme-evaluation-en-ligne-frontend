import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-100 px-6 py-4 ${className}`}>{children}</div>
  );
};

const CardTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-medium mb-0 ${className}`}>{children}</h3>
  );
};

const CardContent = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardContent };