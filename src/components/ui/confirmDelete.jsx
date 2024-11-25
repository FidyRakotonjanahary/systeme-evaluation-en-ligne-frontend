import React from 'react';

const ConfirmDelete = ({
  title = "Êtes-vous sûr ?",
  message = "Voulez-vous vraiment continuer ? Cette action est irréversible",
  onConfirm = () => {},
  onCancel = () => {},
  cancelText = "Annuler",
  confirmText = "Confirmer"
}) => {
  return (
    <div className="fixed inset-0 bg-gray-100/70 backdrop-blur-sm flex items-center justify-center">
      <div className="group select-none w-[350px] flex flex-col p-6 relative items-center justify-center bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-100/95 dark:to-gray-50/95 backdrop-blur-md border border-gray-100 shadow-2xl rounded-xl">
        <div className="relative z-10">
          <div className="text-center p-3 flex-auto justify-center">
            <div className="mb-3 bg-red-100/90 rounded-full p-3 w-fit mx-auto">
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                className="group-hover:animate-bounce w-14 h-14 flex items-center text-red-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold py-4 text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600 px-4">
              {message}
            </p>
          </div>
          <div className="p-4 mt-2 text-center space-x-4">
            <button
              onClick={onCancel}
              className="mb-2 md:mb-0 bg-white px-6 py-2.5 text-sm font-medium tracking-wider text-gray-600 rounded-lg hover:bg-gray-50 transition-all duration-200 ease-in-out shadow-sm border border-gray-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 px-6 py-2.5 text-sm font-medium tracking-wider text-white rounded-lg hover:bg-red-600 transition-all duration-200 ease-in-out shadow-lg shadow-red-500/30"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ConfirmDelete };