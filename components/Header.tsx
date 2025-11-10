import React from 'react';
import { AppView } from '../types';
// Se agregaron las importaciones de iconos faltantes desde el archivo de iconos.
import { HomeIcon, BookStackIcon, DreamHeartIcon, KissIcon, StarDiamondIcon, MagicWandIcon, StarDustIcon, MenuIcon, CloseIcon } from './icons/Icons'; 

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView, projectId?: string | null, initialStyleName?: string, initialTabLabel?: string) => void;
  onRosiClick: () => void;
  onThrowKiss: () => void;
  onNavigateToLatestProject: () => void; 
  onDiaryClick: () => void; // Nueva prop para el botón "Diario"
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

const DesktopNavButton: React.FC<{ icon: React.ReactNode, onClick: () => void, ariaLabel: string, label: string, isActive?: boolean }> = ({ icon, onClick, ariaLabel, label, isActive = false }) => (
    <button 
        onClick={onClick} 
        className={`nav-pill-button py-2 px-3 ${isActive ? 'is-active' : ''} ${label === 'Besos' ? 'btn-besos' : ''}`}
        aria-label={ariaLabel}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, onRosiClick, onThrowKiss, onNavigateToLatestProject, onDiaryClick, isMobileMenuOpen, onToggleMobileMenu }) => {
  return (
    <>
      <header className="header-gradient-bg shadow-lg p-4 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onRosiClick}> {/* RosiClick para el tutorial */}
            <StarDustIcon className="w-10 h-10 text-white" />
            <h1 className="text-4xl main-title text-white">
              Rosi Decora
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            <DesktopNavButton icon={<HomeIcon className="w-6 h-6" />} onClick={() => onNavigate('upload')} isActive={currentView === 'upload'} ariaLabel="Inicio" label="Inicio" />
            <DesktopNavButton icon={<BookStackIcon className="w-6 h-6" />} onClick={() => onNavigate('archive')} isActive={currentView === 'archive'} ariaLabel="Proyectos" label="Proyectos" /> 
            <DesktopNavButton icon={<StarDiamondIcon className="w-6 h-6" />} onClick={onNavigateToLatestProject} isActive={currentView === 'project'} ariaLabel="Tu Último Estilo" label="Tu Estilo" /> 
            <DesktopNavButton icon={<KissIcon className="w-6 h-6" />} onClick={onThrowKiss} ariaLabel="Enviar Besos" label="Besos" /> 
            <DesktopNavButton icon={<DreamHeartIcon className="w-6 h-6" />} onClick={() => onNavigate('favorites')} isActive={currentView === 'favorites'} ariaLabel="Favoritos" label="Favoritos" />
            <DesktopNavButton icon={<MagicWandIcon className="w-6 h-6" />} onClick={onDiaryClick} ariaLabel="Tu Diario" label="Diario" /> {/* Usa onDiaryClick */}
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