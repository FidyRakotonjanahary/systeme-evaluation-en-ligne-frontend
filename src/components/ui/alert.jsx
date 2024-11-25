import React, { useEffect } from 'react';
import { X } from 'lucide-react';

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

export const AlertDialog = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onOpenChange]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="group select-none w-[350px] relative rounded-xl bg-gradient-to-br from-white/90 to-gray-50/90 p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="relative z-10">{children}</div>
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity duration-200"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4 text-gray-600" />
          <span className="sr-only">Fermer</span>
        </button>
      </div>
    </div>
  );
};

export const AlertDialogTitle = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-center p-3 flex-auto justify-center text-2xl font-bold py-4 text-gray-800 ${className}`}
    {...props}
  >
    {children}
  </h2>
));

export const AlertDialogContent = ({ children }) => {
  return <div className="relative z-10">{children}</div>;
};

export const AlertDialogAction = ({ children }) => {
  return <div className="p-4 mt-2 text-center space-x-4">{children}</div>;
};

export const AlertDialogDescription = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm text-gray-600 px-4 ${className}`}
    {...props}
  >
    {children}
  </div>
));