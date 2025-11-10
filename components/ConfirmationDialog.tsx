import React from 'react';
import { Modal } from './Modal';
// Se agregaron las importaciones de iconos faltantes desde el archivo de iconos.
import { ErrorIcon } from './icons/Icons';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} cardClassName="gradient-card" titleClassName="title-gradient"> {/* Changed text-white to title-gradient */}
        <div className="text-center">
            <ErrorIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-text-color-soft mb-8">{message}</p> {/* Changed text-white/70 to text-text-color-soft */}
            <div className="flex justify-end gap-4">
                <button onClick={onClose} className="px-6 py-2 rounded-xl bg-white text-text-color font-semibold shadow-sm hover:bg-gray-100 transition-all">
                    Mejor no
                </button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                    Sí, mi vida
                </button>
            </div>
        </div>
    </Modal>
);