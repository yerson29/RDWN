import React, { useState, useMemo } from 'react';
import { Project, AppView } from '../types';
import { DeleteIcon, ViewIcon, SearchIcon, DreamHeartIcon, SparklesIcon } from './icons/Icons';
import ImageWithFallback from './ImageWithFallback';
import VoiceInputButton from './VoiceInputButton';

interface ArchiveViewProps {
  projects: Project[];
  onView: (projectId: string) => void;
  onDelete: (projectId:string) => void;
  onNavigate: (view: AppView) => void;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ projects, onView, onDelete, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    return projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [projects, searchTerm]);

  if (projects.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <h2 className="text-5xl font-bold title-gradient main-title text-center">¡Tu galería de proyectos está esperando!</h2> 
        <p className="text-text-color-soft mt-2 text-lg">Sube una foto para que la IA cree tu primera inspiración.</p>
        <button onClick={() => onNavigate('upload')} className="mt-6 btn-pill-base btn-main-action text-lg font-semibold shadow-xl rounded-full flex items-center gap-2 mx-auto transform hover:scale-105 transition-transform">
            <div className="icon-orb"><SparklesIcon className="w-6 h-6 animate-sparkle-glow"/></div> <span>Crear Nuevo Proyecto</span>
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto animate-fade-in">
      <h2 className="text-6xl font-bold text-center mb-4 title-gradient main-title">Tu Galería de Proyectos</h2>
      
      <div className="mb-8 max-w-lg mx-auto flex items-center gap-4">
          <div className="relative flex-grow">
              <input 
                  type="text"
                  placeholder="Buscar en tus proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-secondary-accent/30 bg-gray-50 focus:ring-2 focus:ring-primary-accent focus:outline-none transition text-text-color shadow-sm"
                  aria-label="Campo de búsqueda de proyectos"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-color-soft" />
              <VoiceInputButton onResult={setSearchTerm} />
          </div>
          <button onClick={() => onNavigate('upload')} className="btn-pill-base btn-main-action text-sm font-semibold flex-shrink-0 transform hover:scale-105 transition-transform">
              <div className="icon-orb"><SparklesIcon className="w-5 h-5 animate-sparkle-glow"/></div> <span>Nuevo Proyecto</span>
          </button>
      </div>


      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" role="list" aria-label="Lista de tus proyectos guardados">
          {filteredProjects.map(project => (
            <div key={project.id} className="gradient-card rounded-3xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 animate-pop-in" role="listitem" tabIndex={0}>
              <ImageWithFallback 
                  src={project.originalImage} 
                  alt={`Imagen original de tu proyecto: ${project.name}`} 
                  className="w-full h-48 object-cover shadow-md" 
                  fallbackIconClassName="w-1/3 h-1/3"
                  loading="lazy"
              />
              <div className="p-5">
                <h3 className="font-bold text-xl truncate text-text-color">{project.name}</h3>
                <p className="text-sm text-text-color-soft">Creado el: {new Date(project.createdAt).toLocaleDateString()}</p>
                
                <div className="flex gap-2 mt-2 overflow-hidden">
                    {project.styleVariations.slice(0, 4).map(variation => (
                        <ImageWithFallback 
                            key={variation.style_name}
                            src={variation.imageUrl} 
                            alt={variation.style_name}
                            className="w-10 h-10 rounded-md object-cover border-2 border-gray-200 shadow-sm"
                            loading="lazy"
                        />
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    onClick={() => onView(project.id)} 
                    className="btn-solid-icon btn-solid-icon-purple" /* Using btn-solid-icon-purple */
                    title="Ver este proyecto"
                    aria-label={`Ver detalles del proyecto ${project.name}`}
                  >
                      <ViewIcon className="w-5 h-5"/>
                  </button>
                  <button 
                    onClick={() => onDelete(project.id)} 
                    className="btn-solid-icon btn-solid-icon-red" /* Using btn-solid-icon-red */
                    title="Eliminar este proyecto"
                    aria-label={`Eliminar el proyecto ${project.name}`}
                  >
                      <DeleteIcon className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <p className="text-text-color-soft text-lg">¡Oh, no! No encontré ningún proyecto con ese nombre. ¿Probamos con otra búsqueda?</p>
        </div>
      )}
    </div>
  );
};

export default ArchiveView;