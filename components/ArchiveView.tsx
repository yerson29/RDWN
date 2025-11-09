import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { DeleteIcon, ViewIcon, SearchIcon } from './icons/Icons';
import ImageWithFallback from './ImageWithFallback';

interface ArchiveViewProps {
  projects: Project[];
  onView: (projectId: string) => void;
  onDelete: (projectId:string) => void;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ projects, onView, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    return projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [projects, searchTerm]);

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-5xl font-bold title-gradient main-title text-center">¡Tu galería de inspiraciones está esperando!</h2> {/* Centered title */}
        <p className="text-text-color-soft mt-2">Sube una foto para que tu universo de sueños cree tu primera inspiración.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-6xl font-bold text-center mb-4 title-gradient main-title">Tu Galería de Inspiraciones</h2>
      
      <div className="mb-8 max-w-lg mx-auto">
          <div className="relative">
              <input 
                  type="text"
                  placeholder="Buscar en tus inspiraciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-secondary-accent/30 bg-gray-50 focus:ring-2 focus:ring-primary-accent focus:outline-none transition text-text-color" /* Adjusted bg-card-bg to bg-gray-50 */
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-color-soft" />
          </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" role="list" aria-label="Lista de tus inspiraciones guardadas">
          {filteredProjects.map(project => (
            <div key={project.id} className="gradient-card rounded-3xl overflow-hidden group transition-all duration-300 hover:-translate-y-1" role="listitem"> {/* Removed border-white/50 */}
              <ImageWithFallback 
                  src={project.originalImage} 
                  alt={`Imagen original de tu inspiración: ${project.name}`} 
                  className="w-full h-48 object-cover" 
                  fallbackIconClassName="w-1/3 h-1/3"
              />
              <div className="p-5">
                <h3 className="font-bold text-xl truncate text-text-color">{project.name}</h3> {/* Changed text-white to text-text-color */}
                <p className="text-sm text-text-color-soft">Creado el: {new Date(project.createdAt).toLocaleDateString()}</p> {/* Changed text-white/70 to text-text-color-soft */}
                
                <div className="flex gap-2 mt-2 overflow-hidden">
                    {project.styleVariations.slice(0, 4).map(variation => (
                        <ImageWithFallback 
                            key={variation.style_name}
                            src={variation.imageUrl}
                            alt={variation.style_name}
                            className="w-10 h-10 rounded-md object-cover border-2 border-gray-200" /* Changed border-white to border-gray-200 */
                        />
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    onClick={() => onView(project.id)} 
                    className="p-2 rounded-full bg-secondary-accent/20 text-purple-700 hover:bg-secondary-accent/40 transition-all"
                    title="Revivir esta inspiración"
                    aria-label={`Ver detalles de la inspiración ${project.name}`}
                  >
                      <ViewIcon className="w-5 h-5"/>
                  </button>
                  <button 
                    onClick={() => onDelete(project.id)} 
                    className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                    title="Dejar ir esta inspiración"
                    aria-label={`Eliminar la inspiración ${project.name}`}
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
            <p className="text-text-color-soft">No encontré ninguna inspiración con ese nombre.</p> {/* Adjusted text color */}
        </div>
      )}
    </div>
  );
};

export default ArchiveView;