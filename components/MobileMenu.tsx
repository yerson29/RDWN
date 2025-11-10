import React from 'react';
import { AppView } from '../types';
import { HomeIcon, BookStackIcon, DreamHeartIcon, KissIcon, StarDiamondIcon, MagicWandIcon, StarDustIcon, CloseIcon } from './icons/Icons';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: AppView, projectId?: string | null, initialStyleName?: string, initialTabLabel?: string) => void;
    currentView: AppView;
    onRosiClick: () => void;
    onThrowKiss: () => void;
    onNavigateToLatestProject: () => void;
    onDiaryClick: () => void;
}

const MobileNavButton: React.FC<{ icon: React.ReactNode, onClick: () => void, ariaLabel: string, label: string, isActive?: boolean }> = ({ icon, onClick, ariaLabel, label, isActive = false }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center gap-4 w-full px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-200 
                    ${isActive ? 'bg-primary-accent text-white shadow-md' : 'text-text-color hover:bg-gray-100'}`}
        aria-label={ariaLabel}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigate, currentView, onRosiClick, onThrowKiss, onNavigateToLatestProject, onDiaryClick }) => {
    const handleNavigateAndClose = (view: AppView, projectId?: string | null, initialStyleName?: string, initialTabLabel?: string) => {
        onNavigate(view, projectId, initialStyleName, initialTabLabel);
        onClose();
    };

    const handleDiaryClickAndClose = () => {
        onDiaryClick();
        onClose();
    };

    const handleLatestProjectAndClose = () => {
        onNavigateToLatestProject();
        onClose();
    };

    const handleRosiClickAndClose = () => {
        onRosiClick();
        onClose();
    }

    const handleThrowKissAndClose = () => {
        onThrowKiss();
        onClose(); // Close menu even if kiss animation happens
    }

    return (
        <div 
            className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isOpen ? 'visible bg-black/40' : 'invisible'}`}
            onClick={onClose} // Close menu when clicking outside
        >
            <div 
                className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside menu
                role="dialog"
                aria-modal="true"
                aria-label="Menú de navegación principal"
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={handleRosiClickAndClose}>
                        <StarDustIcon className="w-8 h-8 text-white" />
                        <h2 className="text-3xl main-title text-white">Rosi Decora</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Cerrar menú"
                    >
                        <CloseIcon className="w-7 h-7" />
                    </button>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    <MobileNavButton icon={<HomeIcon className="w-6 h-6" />} onClick={() => handleNavigateAndClose('upload')} isActive={currentView === 'upload'} ariaLabel="Inicio" label="Inicio" />
                    <MobileNavButton icon={<BookStackIcon className="w-6 h-6" />} onClick={() => handleNavigateAndClose('archive')} isActive={currentView === 'archive'} ariaLabel="Proyectos" label="Proyectos" />
                    <MobileNavButton icon={<StarDiamondIcon className="w-6 h-6" />} onClick={handleLatestProjectAndClose} isActive={currentView === 'project'} ariaLabel="Tu Último Estilo" label="Tu Estilo" />
                    <MobileNavButton icon={<KissIcon className="w-6 h-6" />} onClick={handleThrowKissAndClose} ariaLabel="Enviar Besos" label="Besos" />
                    <MobileNavButton icon={<DreamHeartIcon className="w-6 h-6" />} onClick={() => handleNavigateAndClose('favorites')} isActive={currentView === 'favorites'} ariaLabel="Favoritos" label="Favoritos" />
                    <MobileNavButton icon={<MagicWandIcon className="w-6 h-6" />} onClick={handleDiaryClickAndClose} isActive={currentView === 'project' && currentView === 'project'} ariaLabel="Tu Diario" label="Diario" />
                </nav>
            </div>
        </div>
    );
};

export default MobileMenu;