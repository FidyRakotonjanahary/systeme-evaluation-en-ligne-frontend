import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Dialog = ({ open, onOpenChange, children }) => {
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

const DialogContent = ({ children }) => {
  return <div className="relative z-10">{children}</div>;
};

const DialogTitle = ({ children }) => {
  return <h2 className="text-center p-3 flex-auto justify-center text-2xl font-bold py-4 text-gray-800">{children}</h2>;
};

const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

const DialogFooter = ({ children }) => {
  return <div className="p-4 mt-2 text-center space-x-4">{children}</div>;
};

const DialogDescription = ({ children }) => {
  return <p className="text-sm text-gray-600 px-4">{children}</p>;
};

const DialogClose = ({ onClose }) => {
  return (
    <button
      className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity duration-200"
      onClick={onClose}
    >
      <X className="h-4 w-4 text-gray-600" />
      <span className="sr-only">Fermer</span>
    </button>
  );
};

export {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogClose
};