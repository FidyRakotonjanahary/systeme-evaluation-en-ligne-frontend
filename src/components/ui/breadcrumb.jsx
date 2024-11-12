import React from 'react';

const BreadcrumbList = ({ children, className = "", ...props }) => {
  return (
    <ol className={`flex flex-wrap items-center gap-1.5 break-words ${className}`} {...props}>
      {children}
    </ol>
  );
};

const BreadcrumbItem = ({ children, className = "", ...props }) => {
  return (
    <li className={`inline-flex items-center gap-1.5 ${className}`} {...props}>
      {children}
    </li>
  );
};

const BreadcrumbLink = ({ 
  children, 
  className = "", 
  href = "#",
  onClick,
  ...props 
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center text-sm font-medium transition-colors hover:text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};

const BreadcrumbSeparator = ({ className = "", children, ...props }) => {
  return (
    <li className={`inline-flex items-center ${className}`} {...props}>
      <span className="text-gray-500">{children || "/"}</span>
    </li>
  );
};

const Breadcrumb = ({ children, className = "", ...props }) => {
  return (
    <nav 
      className={`flex ${className}`} 
      aria-label="breadcrumb"
      {...props}
    >
      {children}
    </nav>
  );
};

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
};