import React, { useState, useEffect, useRef } from 'react';
import { StyleVariation, Iteration } from '../types';
import ImageWithFallback from './ImageWithFallback';
// Se agregaron las importaciones de iconos faltantes desde el archivo de iconos.
import { RevertIcon, ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

interface RefinementPanelProps {
  styleVariation: StyleVariation;
  onRefine: (prompt: string) => void;
  onRevert: () => void;
  currentIterationIndex: number;
  onSelectIteration: (index: number) => void;
}

const RefinementPanel: React.FC<RefinementPanelProps> = ({ styleVariation, onRefine, onRevert, currentIterationIndex, onSelectIteration }) => {
  const [prompt, setPrompt] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const allImages = [
      { imageUrl: styleVariation.imageUrl, prompt: "Tu diseño inicial", type: 'initial' },
      ...styleVariation.iterations.map(iter => ({ imageUrl: iter.imageUrl, prompt: iter.prompt, type: 'iteration' }))
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth / 2; // Scroll half the visible width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onRefine(prompt);
      setPrompt('');
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <h4 className="text-3xl main-title mb-4 title-gradient text-center">Tu Visión: Susúrrale tus Ideas...</h4> {/* Centered title */}
      
      {allImages.length > 0 && (
          <div className="mb-4">
              <h5 className="font-semibold text-text-color-soft mb-2">Tu Evolución:</h5> {/* Changed text-white/70 to text-text-color-soft */}
              <div className="relative flex items-center">
                <button 
                    onClick={() => handleScroll('left')} 
                    disabled={currentIterationIndex === 0 && allImages.length <= 1} // Only disable if at first and no other options
                    className="absolute -left-2 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Ver iteración anterior"
                >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-600"/>
                </button>
                <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-grow" role="list" aria-label="Historial de iteraciones de diseño">
                   {allImages.map((iter, index) => (
                       <button
                           key={index} 
                           onClick={() => onSelectIteration(index)}
                           className={`flex-shrink-0 text-center group relative p-1 rounded-lg transition-all border-2 
                           ${currentIterationIndex === index ? 'border-primary-accent ring-2 ring-primary-accent/50 scale-105' : 'border-transparent hover:border-gray-300'}`}
                           aria-current={currentIterationIndex === index ? 'true' : 'false'}
                           aria-label={`Ver iteración ${index} de diseño: ${iter.prompt}`}
                           title={iter.prompt}
                       >
                           <ImageWithFallback 
                               src={iter.imageUrl} 
                               alt={`Iteración ${index}: ${iter.prompt}`} 
                               className="w-16 h-16 rounded-lg object-cover shadow-md"
                               fallbackIconClassName="w-8 h-8"
                               loading="lazy"
                           />
                           <span className="absolute bottom-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded-full">#{index}</span>
                       </button>
                   ))}
                </div>
                <button 
                    onClick={() => handleScroll('right')} 
                    disabled={currentIterationIndex === allImages.length - 1 && allImages.length <= 1} // Only disable if at last and no other options
                    className="absolute -right-2 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Ver iteración siguiente"
                >
                    <ChevronRightIcon className="w-5 h-5 text-gray-600"/>
                </button>
              </div>
          </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Cuéntale tu visión. Ej: 'Un sofá que abrace tu espíritu' o 'Paredes con el color de tu felicidad'..."
          className="w-full p-3 border border-secondary-accent/50 rounded-2xl mb-3 focus:ring-2 focus:ring-primary-accent focus:border-transparent transition bg-gray-50 text-text-color"
          rows={3}
          aria-label="Introduce tu solicitud de refinamiento de diseño"
        ></textarea>
        <p className="text-sm text-text-color-soft mb-4 text-center"> {/* Changed text-white/70 to text-text-color-soft */}
            Cuéntale con detalle qué imaginas, y tu universo de sueños lo hará realidad.
        </p>
        <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="flex-grow py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Generar una nueva versión del diseño"
            >
              Transformar
            </button>
            <button
                type="button"
                onClick={onRevert}
                disabled={styleVariation.iterations.length === 0}
                className="flex-shrink-0 p-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100" /* Adjusted button styling */
                aria-label="Volver a la versión anterior"
                title="Volver a tu última inspiración"
            >
                <RevertIcon className="w-6 h-6"/>
            </button>
        </div>
      </form>
    </div>
  );
};

export default RefinementPanel;