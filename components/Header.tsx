import React from 'react';
import { AppView } from '../types';
import { HomeIcon, BookStackIcon, SparkleHeartIcon, KissIcon, SparklesIcon, StarFilledIcon } from './icons/Icons';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onRosiClick: () => void;
  onThrowKiss: () => void;
  onNavigateToLatestProject: () => void; // New prop
}

// NavButton component removed as it's no longer used.

// Modified DesktopNavButton to take icon and label
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

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, onRosiClick, onThrowKiss, onNavigateToLatestProject }) => {
  return (
    <>
      {/* Desktop Header (now visible on all screen sizes, removed 'hidden sm:block') */}
      <header className="header-gradient-bg shadow-lg p-4 sticky top-0 z-40 block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('upload')}>
            <SparklesIcon className="w-10 h-10 text-white" />
            <h1 className="text-4xl main-title text-white">
              Rosi Decora
            </h1>
          </div>
          <nav className="flex items-center gap-2">
            <DesktopNavButton icon={<HomeIcon className="w-6 h-6" />} onClick={() => onNavigate('upload')} isActive={currentView === 'upload'} ariaLabel="Inicio" label="Inicio" />
            <DesktopNavButton icon={<BookStackIcon className="w-6 h-6" />} onClick={() => onNavigate('archive')} isActive={currentView === 'archive'} ariaLabel="Proyectos" label="Proyectos" /> {/* Changed label and ariaLabel */}
            <DesktopNavButton icon={<SparklesIcon className="w-6 h-6" />} onClick={onNavigateToLatestProject} isActive={currentView === 'project'} ariaLabel="Tu Último Estilo" label="Tu Estilo" /> {/* New button */}
            <DesktopNavButton icon={<KissIcon className="w-6 h-6" />} onClick={onThrowKiss} ariaLabel="Enviar Besos" label="Besos" /> {/* Besos al medio */}
            <DesktopNavButton icon={<StarFilledIcon className="w-6 h-6" />} onClick={() => onNavigate('favorites')} isActive={currentView === 'favorites'} ariaLabel="Favoritos" label="Favoritos" />
            <DesktopNavButton icon={<SparkleHeartIcon className="w-6 h-6" />} onClick={onRosiClick} ariaLabel="Tu Diario" label="Diario" />
          </nav>
        </div>
      </header>
      
      {/* Mobile Title (visible on non-upload views) - REMOVED */}
      {/* Mobile Bottom Navigation - REMOVED */}
    </>
  );
};

export default Navigation;