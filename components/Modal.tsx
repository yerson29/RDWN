import React from 'react';
import { CloseIcon } from './icons/Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    cardClassName?: string; // New: Optional class for the modal's card container
    titleClassName?: string; // New: Optional class for the modal's title
    headerRightContent?: React.ReactNode; // New: Content to display on the right side of the header
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, cardClassName = "gradient-card", titleClassName = "title-gradient", headerRightContent }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex justify-center items-center z-50 animate-fade-in p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className={`${cardClassName} rounded-3xl w-full max-w-md animate-scale-in`} onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className={`text-2xl font-bold main-title ${titleClassName}`}>{title}</h3>
                    <div className="flex items-center gap-4"> {/* Wrapper for right content and close button */}
                        {headerRightContent}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors" aria-label="Cerrar modal">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};