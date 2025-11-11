import React, { useEffect } from 'react';
import { CloseIcon, DreamHeartIcon } from './icons/Icons';

interface MotivationMessageProps {
  message: string;
  onClose: () => void;
}

const MotivationMessage: React.FC<MotivationMessageProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Mensaje visible por 4 segundos
    return () => clearTimeout(timer);
  }, [onClose, message]);

  return (
    <div 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-xl border border-gray-200 motivation-message-card shadow-xl flex items-center gap-4 max-w-sm animate-fade-in" 
      role="status"
      aria-live="polite"
    >
      <DreamHeartIcon className="w-6 h-6 flex-shrink-0 text-primary-accent" />
      <p className="text-sm font-semibold text-text-color">
        {message}
      </p>
      <button onClick={onClose} className="ml-auto p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Cerrar mensaje de motivación">
        <CloseIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MotivationMessage;