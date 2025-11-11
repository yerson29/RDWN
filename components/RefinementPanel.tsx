import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleVariation, Iteration, ImageBase64 } from '../types';
import ImageWithFallback from './ImageWithFallback';
import { RevertIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from './icons/Icons';
import { ImageComparator } from './UtilityComponents'; // Importar ImageComparator
import RefineTutorial from './RefineTutorial'; // Importar el tutorial de refinamiento

interface RefinementPanelProps {
  projectId: string; // Nuevo: ID del proyecto
  styleVariation: StyleVariation;
  onGenerateRefinement: (base64Data: string, mimeType: string, prompt: string, styleName: string) => Promise<{ newImage: ImageBase64; newDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'> }>; // Para generar preview
  onCommitRefinement: (projectId: string, styleName: string, prompt: string, generatedImage: ImageBase64, generatedDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'>, currentIterationIndex: number) => void; // Para aplicar refinamiento
  // onRevert eliminado
  currentIterationIndex: number;
  onSelectIteration: (index: number) => void;
  showRefineTutorial: boolean; // Prop para controlar el tutorial
  setShowRefineTutorial: React.Dispatch<React.SetStateAction<boolean>>; // Setter para el tutorial
}

const RefinementPanel: React.FC<RefinementPanelProps> = ({ 
  projectId,
  styleVariation, 
  onGenerateRefinement, 
  onCommitRefinement, 
  currentIterationIndex, 
  onSelectIteration,
  showRefineTutorial,
  setShowRefineTutorial,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewRefinement, setPreviewRefinement] = useState<{ image: ImageBase64; details: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'> } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Efecto para mostrar el tutorial la primera vez que se accede al panel
  useEffect(() => {
    const hasSeenRefineTutorial = localStorage.getItem('rosi-decora-refine-tutorial-seen');
    if (!hasSeenRefineTutorial) {
        setShowRefineTutorial(true);
        // localStorage.setItem('rosi-decora-refine-tutorial-seen', 'true'); // Set once user closes it
    }
  }, [setShowRefineTutorial]);

  // Restablecer el estado de vista previa cuando el estilo seleccionado cambia
  useEffect(() => {
    setPrompt('');
    setIsGeneratingPreview(false);
    setPreviewRefinement(null);
  }, [styleVariation]);

  // Se construye el array de imágenes para el historial, incluyendo la imagen base del estilo como la "iteración 0"
  const allImages = useMemo(() => {
    return [
      { 
          imageUrl: styleVariation.imageUrl, 
          prompt: "Diseño Inicial", 
          type: 'initial', 
          imageBase64: styleVariation.imageBase64 
      },
      ...styleVariation.iterations.map(iter => ({ 
          imageUrl: iter.imageUrl, 
          prompt: iter.prompt, 
          type: 'iteration', 
          imageBase64: iter.imageBase64 
      }))
    ];
  }, [styleVariation]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth / 2; // Scroll half the visible width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleGeneratePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGeneratingPreview) return;

    // La imagen a refinar es la que se muestra actualmente en la línea de tiempo.
    // Si currentIterationIndex es 0, es la imagen base del estilo.
    // Si es > 0, es la imagen de la iteración correspondiente.
    const currentImageToRefineBase64 = allImages[currentIterationIndex]?.imageBase64;
      
    if (!currentImageToRefineBase64?.data) { // Ensure data exists
      throw new Error("No se pudo obtener la imagen base para el refinamiento.");
    }

    setIsGeneratingPreview(true);
    setPreviewRefinement(null); // Limpiar cualquier preview anterior

    try {
      const result = await onGenerateRefinement(currentImageToRefineBase64.data, currentImageToRefineBase64.mimeType, prompt, styleVariation.style_name);
      setPreviewRefinement(result); // Guardar la imagen y detalles de la vista previa
    } catch (error) {
      console.error("Error generando vista previa:", error);
      // El error se maneja globalmente en App.tsx, aquí solo reseteamos el estado
      // y permitimos que App.tsx muestre el errorMessage
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleApplyRefinement = () => {
    if (!previewRefinement || !prompt.trim()) return;

    // Llamar a la función de App.tsx para aplicar el refinamiento
    onCommitRefinement(
      projectId,
      styleVariation.style_name,
      prompt,
      previewRefinement.image,
      previewRefinement.details,
      currentIterationIndex // Pasamos el índice actual para truncar el historial si es necesario
    );

    setPreviewRefinement(null); // Limpiar la vista previa
    setPrompt(''); // Limpiar el prompt
    // El currentIterationIndex se actualizará automáticamente en ProjectView debido al cambio en allProjects
  };

  const handleCancelPreview = () => {
    setPreviewRefinement(null);
    setIsGeneratingPreview(false);
    setPrompt('');
  };

  const handleUndo = useCallback(() => {
    if (currentIterationIndex > 0) {
      onSelectIteration(currentIterationIndex - 1);
      setPreviewRefinement(null); // Limpiar cualquier vista previa al deshacer
    }
  }, [currentIterationIndex, onSelectIteration]);

  const handleRedo = useCallback(() => {
    if (currentIterationIndex < allImages.length - 1) {
      onSelectIteration(currentIterationIndex + 1);
      setPreviewRefinement(null); // Limpiar cualquier vista previa al rehacer
    }
  }, [currentIterationIndex, onSelectIteration, allImages.length]);
  
  return (
    <div className="flex flex-col h-full">
      {showRefineTutorial && <RefineTutorial onClose={() => setShowRefineTutorial(false)} />}
      <h4 className="text-3xl main-title mb-4 title-gradient text-center">Tu Visión: Susúrrale tus Ideas...</h4> {/* Centered title */}
      
      {allImages.length > 0 && (
          <div className="mb-4">
              <h5 className="font-semibold text-text-color-soft mb-2">Tu Evolución:</h5>
              <div className="relative flex items-center">
                <button 
                    onClick={handleUndo} 
                    disabled={currentIterationIndex === 0 || isGeneratingPreview} // Deshabilitar si no hay historial o generando preview
                    className="absolute -left-2 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Deshacer última acción"
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
                               src={iter.imageUrl} // iter.imageUrl can be string | null
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
                    onClick={handleRedo} 
                    disabled={currentIterationIndex === allImages.length - 1 || isGeneratingPreview} // Deshabilitar si no hay historial futuro o generando preview
                    className="absolute -right-2 z-10 p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label="Rehacer última acción deshecha"
                >
                    <ChevronRightIcon className="w-5 h-5 text-gray-600"/>
                </button>
              </div>
          </div>
      )}

      {previewRefinement && allImages[currentIterationIndex]?.imageUrl ? (
        <div className="mb-4 flex flex-col gap-4">
            <h5 className="font-semibold text-text-color-soft text-center">Vista Previa de tu Magia:</h5>
            <ImageComparator
                before={allImages[currentIterationIndex]?.imageUrl} // imageUrl can be string | null
                after={previewRefinement.image.data
                    ? `data:${previewRefinement.image.mimeType};base64,${previewRefinement.image.data}`
                    : null}
            />
            <p className="text-sm text-text-color-soft text-center">{previewRefinement.details.description}</p>
            <div className="flex gap-2">
                <button
                    onClick={handleApplyRefinement}
                    disabled={isGeneratingPreview}
                    className="flex-grow py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    aria-label="Aplicar este refinamiento al diseño"
                >
                    Aplicar Refinamiento
                </button>
                <button
                    type="button"
                    onClick={handleCancelPreview}
                    className="flex-shrink-0 p-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow-lg hover:bg-gray-300 transition-transform"
                    aria-label="Cancelar vista previa y volver al diseño actual"
                >
                    Cancelar
                </button>
            </div>
        </div>
      ) : (
        <form onSubmit={handleGeneratePreview}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Cuéntale tu visión. Ej: 'Un sofá que abrace tu espíritu' o 'Paredes con el color de tu felicidad'..."
              className="w-full p-3 border border-secondary-accent/50 rounded-2xl mb-3 focus:ring-2 focus:ring-primary-accent focus:border-transparent transition bg-gray-50 text-text-color"
              rows={3}
              aria-label="Introduce tu solicitud de refinamiento de diseño"
            ></textarea>
            <p className="text-sm text-text-color-soft mb-4 text-center">
                Cuéntale con detalle qué imaginas, y tu universo de sueños lo hará realidad.
            </p>
            <button
              type="submit"
              disabled={!prompt.trim() || isGeneratingPreview}
              className="w-full py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Generar una vista previa del diseño"
            >
              {isGeneratingPreview ? (
                <>
                  <SparklesIcon className="w-5 h-5 animate-spin" />
                  Tejiendo Vista Previa...
                </>
              ) : (
                <>
                  Generar Vista Previa
                </>
              )}
            </button>
        </form>
      )}
    </div>
  );
};

export default RefinementPanel;