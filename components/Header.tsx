import React from 'react';
import { AppView } from '../types';
import { HomeIcon, BookStackIcon, DreamHeartIcon, KissIcon, StarDiamondIcon, MagicWandIcon, StarDustIcon, MenuIcon, CloseIcon, ChatIcon } from './icons/Icons'; 

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView, projectId?: string | null, initialStyleName?: string, initialTabLabel?: string) => void;
  onTutorialClick: () => void; // Renamed from onRosiClick
  onThrowKiss: () => void;
  onNavigateToLatestProject: () => void; 
  onDiaryClick: () => void; // Nueva prop para el botón "Diario"
  onOpenChatbot: () => void; // New prop for opening the chatbot
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

const DesktopNavButton: React.FC<{ icon: React.ReactNode, onClick: () => void, ariaLabel: string, label: string, isActive?: boolean }> = ({ icon, onClick, ariaLabel, label, isActive = false }) => (
    <button 
        onClick={onClick} 
        className={`nav-pill-button py-2 px-3 ${isActive ? 'is-active' : ''}`}
        aria-label={ariaLabel}
        aria-current={isActive ? 'page' : undefined}
        role="button"
        title={label}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, onTutorialClick, onThrowKiss, onNavigateToLatestProject, onDiaryClick, onOpenChatbot, isMobileMenuOpen, onToggleMobileMenu }) => {
  return (
    <>
      <header className="header-gradient-bg shadow-lg p-4 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onTutorialClick} role="button" aria-label="Abrir tutorial de Rosi Decora">
            <StarDustIcon className="w-10 h-10 text-white" />
            <h1 className="text-4xl main-title text-white">
              Rosi Decora
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Navegación principal de escritorio">
            <DesktopNavButton icon={<HomeIcon className="w-6 h-6" />} onClick={() => onNavigate('upload')} isActive={currentView === 'upload'} ariaLabel="Ir a la página de inicio para subir imágenes" label="Inicio" />
            <DesktopNavButton icon={<BookStackIcon className="w-6 h-6" />} onClick={() => onNavigate('archive')} isActive={currentView === 'archive'} ariaLabel="Ver todos tus proyectos guardados" label="Proyectos" /> 
            <DesktopNavButton icon={<StarDiamondIcon className="w-6 h-6" />} onClick={onNavigateToLatestProject} isActive={currentView === 'project'} ariaLabel="Ver tu último estilo de diseño" label="Tu Estilo" /> 
            <DesktopNavButton icon={<KissIcon className="w-6 h-6" />} onClick={onThrowKiss} ariaLabel="Enviar un beso de magia" label="Besos" /> 
            <DesktopNavButton icon={<DreamHeartIcon className="w-6 h-6" />} onClick={() => onNavigate('favorites')} isActive={currentView === 'favorites'} ariaLabel="Ver tus diseños favoritos" label="Favoritos" />
            <DesktopNavButton icon={<MagicWandIcon className="w-6 h-6" />} onClick={onDiaryClick} isActive={currentView === 'diary'} ariaLabel="Acceder a tu diario de diseño" label="Diario" />
            <DesktopNavButton icon={<ChatIcon className="w-6 h-6" />} onClick={onOpenChatbot} isActive={false} ariaLabel="Chatear con tu asistente de diseño" label="Chat" />
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={onToggleMobileMenu} 
              className="p-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMobileMenuOpen ? <CloseIcon className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navigation;