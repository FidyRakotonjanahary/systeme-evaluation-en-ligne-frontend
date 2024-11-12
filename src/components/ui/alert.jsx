import React from 'react';

const alertStyles = {
  base: "relative w-full rounded-lg border p-4",
  variants: {
    default: "bg-white border-gray-200",
    destructive: "bg-red-50 border-red-200 text-red-600",
    success: "bg-green-50 border-green-200 text-green-600"
  },
  icon: {
    base: "absolute left-4 top-4",
    variants: {
      default: "text-gray-600",
      destructive: "text-red-600",
      success: "text-green-600"
    }
  }
};

export const Alert = React.forwardRef(({ 
  className = '', 
  variant = 'default', 
  children, 
  icon, 
  ...props 
}, ref) => {
  const styles = [
    alertStyles.base,
    alertStyles.variants[variant],
    icon && 'pl-12',
    className
  ].join(' ');

  return (
    <div ref={ref} role="alert" className={styles} {...props}>
      {icon && (
        <span className={`${alertStyles.icon.base} ${alertStyles.icon.variants[variant]}`}>
          {icon}
        </span>
      )}
      {children}
    </div>
  );
});

export const AlertTitle = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none ${className}`}
    {...props}
  >
    {children}
  </h5>
));

export const AlertDescription = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </div>
));