import React, { useState, useMemo } from 'react';
import { FavoriteDesign } from '../types';
// Se agregaron las importaciones de iconos faltantes desde el archivo de iconos.
import { DeleteIcon, ViewIcon, DreamHeartIcon, SearchIcon } from './icons/Icons';
import ImageWithFallback from './ImageWithFallback';

interface FavoritesViewProps {
  favorites: FavoriteDesign[];
  onView: (projectId: string, initialStyleName?: string) => void;
  onDelete: (favoriteId: string) => void;
  onNavigateToUpload: () => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onView, onDelete, onNavigateToUpload }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFavorites = useMemo(() => {
    if (!searchTerm) return favorites;
    return favorites.filter(f => 
        f.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.styleVariation.style_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [favorites, searchTerm]);

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center justify-center gap-6">
        <DreamHeartIcon className="w-24 h-24 text-primary-accent mx-auto" />
        <h2 className="text-5xl font-bold title-gradient main-title text-center">¡Aún no hay joyas en tu cofre! ¡Te invitamos a crearlas.</h2> {/* Centered title */}
        <p className="text-text-color-soft mt-2 text-lg">
            Cuando un diseño te robe el aliento, guárdalo aquí como tu joya más preciada.
        </p>
        <button onClick={onNavigateToUpload} className="px-8 py-4 btn-primary text-lg font-semibold shadow-xl rounded-full flex items-center gap-2">
            <DreamHeartIcon className="w-6 h-6"/> ¡A crear nuevas joyas para tu espacio!
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-6xl font-bold text-center mb-4 title-gradient main-title">Tus Joyas Favoritas</h2>
      
      <div className="mb-8 max-w-lg mx-auto">
          <div className="relative">
              <input 
                  type="text"
                  placeholder="Buscar tus joyas de diseño..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-secondary-accent/30 bg-gray-50 focus:ring-2 focus:ring-primary-accent focus:outline-none transition text-text-color" /* Adjusted bg-card-bg to bg-gray-50 */
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-color-soft" />
          </div>
      </div>

      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" role="list" aria-label="Lista de diseños favoritos">
          {filteredFavorites.map(fav => (
            <div key={fav.id} className="gradient-card rounded-3xl overflow-hidden group transition-all duration-300 hover:-translate-y-1" role="listitem"> {/* Removed border-white/50 */}
              <ImageWithFallback 
                  src={fav.styleVariation.imageUrl} 
                  alt={`Diseño favorito: ${fav.styleVariation.style_name} de ${fav.projectName}`} 
                  className="w-full h-48 object-cover" 
                  fallbackIconClassName="w-1/3 h-1/3"
                  loading="lazy"
              />
              <div className="p-5">
                <h3 className="font-bold text-xl truncate text-text-color">{fav.styleVariation.style_name}</h3> {/* Changed text-white to text-text-color */}
                <p className="text-sm text-text-color-soft">Proyecto: {fav.projectName}</p> {/* Changed text-white/70 to text-text-color-soft */}
                <p className="text-xs text-text-color-soft mt-1">Guardado el: {new Date(fav.favoritedAt).toLocaleDateString()}</p> {/* Changed text-white/70 to text-text-color-soft */}
                
                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    onClick={() => onView(fav.projectId, fav.styleVariation.style_name)} 
                    className="p-2 rounded-full bg-secondary-accent/20 text-purple-700 hover:bg-secondary-accent/40 transition-all"
                    title="Ver detalles de esta joya"
                    aria-label={`Ver detalles del diseño favorito ${fav.styleVariation.style_name}`}
                  >
                      <ViewIcon className="w-5 h-5"/>
                  </button>
                  <button 
                    onClick={() => onDelete(fav.id)} 
                    className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                    title="Dejar ir esta joya"
                    aria-label={`Eliminar el diseño favorito ${fav.styleVariation.style_name}`}
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
            <p className="text-text-color-soft">No encontré ninguna joya con ese nombre.</p> {/* Adjusted text color */}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;