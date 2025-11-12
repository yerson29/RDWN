import React from 'react';
import { Modal } from './Modal';
import { ErrorIcon, CloseIcon, DreamHeartIcon } from './icons/Icons';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title} cardClassName="gradient-card" titleClassName="title-gradient">
        <div className="text-center">
            <ErrorIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-text-color-soft mb-8">{message}</p>
            <div className="flex justify-end gap-4">
                <button onClick={onClose} className="btn-pill-base btn-secondary-action" aria-label="Cancelar la acción"> {/* Using btn-secondary-action */}
                    <div className="icon-orb"><CloseIcon className="w-5 h-5"/></div>
                    <span>Mejor no</span>
                </button>
                <button onClick={onConfirm} className="btn-pill-base btn-main-action-danger" aria-label="Confirmar la acción">
                    <div className="icon-orb"><DreamHeartIcon className="w-5 h-5"/></div> {/* Using a dream heart icon for confirmation */}
                    <span>Sí, mi vida</span>
                </button>
            </div>
        </div>
    </Modal>
);