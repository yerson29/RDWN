import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Project, StyleVariation, Furniture, ImageBase64, Comment } from '../types';
import RefinementPanel from './RefinementPanel';
import FurnitureList from './FurnitureList';
import ImageWithFallback from './ImageWithFallback';
import { DreamHeartIcon, ShareIcon, EditIcon, ClipboardIcon, ChevronLeftIcon, ChevronRightIcon, CommentIcon as DiaryIcon, BookOpenIcon, StarDustIcon, SparklesIcon } from './icons/Icons';

// ALL_STYLES is now imported from types.ts
import { ALL_STYLES } from '../types';

// Import newly extracted components
// import { CommentsSection } from './DiaryViewSections'; // Se movió al DiaryView, no se usa aquí.
import { ImageComparator, Tabs, ColorPalette } from './UtilityComponents';
// FIX: Se actualiza la importación para que coincida con la exportación corregida en seedData.ts
import { REFLECTIVE_PHRASES } from '../seedData'; // Importar frases reflexivas directamente


// --- MAIN COMPONENT ---

interface ProjectViewProps {
  project: Project;
  initialStyleName?: string;
  onGenerateRefinement: (base64Data: string, mimeType: string, prompt: string, styleName: string) => Promise<{ newImage: ImageBase64; newDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'> }>; // Nuevo prop
  onCommitRefinement: (projectId: string, styleName: string, prompt: string, generatedImage: ImageBase64, generatedDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'>, currentIterationIndex: number) => void; // Nuevo prop
  onFavorite: (designToFavorite: StyleVariation, projectId: string, projectName: string) => void;
  // onRevert: (project: Project, styleName: string) => void; // Eliminado
  onSaveProjectName: (newName: string) => void;
  onSaveComment: (projectId: string, styleName: string, text: string) => void;
  onGenerateStory: (imageBase64: ImageBase64, styleName: string, projectAnalysis: string) => void;
  initialActiveTabLabel?: string; // Nuevo: Para establecer la pestaña activa al montar
  showRefineTutorial: boolean; // Prop para controlar el tutorial
  setShowRefineTutorial: React.Dispatch<React.SetStateAction<boolean>>; // Setter para el tutorial
  onGenerateNextStyle: (projectId: string) => Promise<void>; // NUEVO: para generar estilos individualmente
}


const StyleCard: React.FC<{ variation: StyleVariation; onSelect: () => void; isSelected: boolean; phrase: string }> = ({ variation, onSelect, isSelected, phrase }) => {
    const latestIteration = variation.iterations.length > 0 ? variation.iterations[variation.iterations.length - 1] : null;
    // Ensure `displayImage` is null if no valid image URL
    const displayImage = latestIteration?.imageUrl || variation.imageUrl || null;

    return (
        <div 
            className={`gradient-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-primary-accent scale-105' : 'hover:scale-[1.02]'}`}
            onClick={onSelect}
            aria-label={`Seleccionar estilo ${variation.style_name}`}
            role="button"
            tabIndex={0}
        >
            <ImageWithFallback 
                src={displayImage} // displayImage can be string | null
                alt={variation.style_name} 
                className="w-full h-24 sm:h-32 object-cover animate-fade-in" // Added animate-fade-in here
                fallbackIconClassName="w-1/2 h-1/2"
                loading="lazy"
            />
            <div className="p-3">
                <h3 className="text-sm sm:text-base font-bold text-text-color truncate">{variation.style_name}</h3>
                <p className="text-xs text-text-color-soft italic mt-1">{phrase}</p>
            </div>
        </div>
    );
};

const StyleCardSkeleton: React.FC<{ styleName: string; originalImage: string | null; phrase: string; isLoading?: boolean }> = ({ styleName, originalImage, phrase, isLoading = false }) => (
    <div className="gradient-card rounded-2xl overflow-hidden animate-fade-in">
        <div className="relative w-full h-24 sm:h-32">
            {/* Show a blurred version of the original image as background */}
            <ImageWithFallback
                src={originalImage} // originalImage can be string | null
                alt="Cargando estilo..."
                className="w-full h-full object-cover blur-sm brightness-75" 
                fallbackIconClassName="w-1/2 h-1/2"
                loading="lazy"
            />
            {/* Overlay with spinner and loading phrase */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2">
                 {isLoading && <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-primary-accent mb-2"></div>}
                 <p className="text-white text-xs text-center font-semibold">{phrase}</p>
            </div>
        </div>
        <div className="p-3">
            <h3 className="text-sm sm:text-base font-bold text-text-color truncate shimmer-effect rounded-md w-3/4 h-5 animate-none"></h3> {/* Simulate text */}
        </div>
    </div>
);


const ProjectView: React.FC<ProjectViewProps> = ({ project, initialStyleName, onGenerateRefinement, onCommitRefinement, onFavorite, onSaveProjectName, onSaveComment, onGenerateStory, initialActiveTabLabel, showRefineTutorial, setShowRefineTutorial, onGenerateNextStyle }) => {
    const [selectedStyle, setSelectedStyle] = useState<StyleVariation | null>(null);
    const [currentIterationIndex, setCurrentIterationIndex] = useState(0);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newProjectName, setNewProjectName] = useState(project.name);
    const [isGeneratingSingleStyle, setIsGeneratingSingleStyle] = useState(false); // NEW: State for single style generation
    const [generatedStyleErrors, setGeneratedStyleErrors] = useState<Record<string, string | null>>({}); // NEW: Track errors for individual style generation

    // Memoize phrases to remain consistent for each style card across re-renders
    const stylePhrases = useMemo(() => {
        const phrasesMap: Record<string, string> = {};
        ALL_STYLES.forEach(styleName => {
            phrasesMap[styleName] = REFLECTIVE_PHRASES[Math.floor(Math.random() * REFLECTIVE_PHRASES.length)];
        });
        return phrasesMap;
    }, [project.id]); // Re-generate phrases only if project.id changes (REFLECTIVE_PHRASES is constant)

    // Effect to initialize the selected style from various sources (props, localStorage, or fallback)
    useEffect(() => {
        // Find existing style variations
        const availableStyles = project.styleVariations;
    
        if (availableStyles.length === 0) {
            setSelectedStyle(null); // No styles loaded yet
            return; 
        }
    
        let styleToSelect: StyleVariation | undefined;
    
        // Priority 1: A specific style name is passed in props (e.g., from favorites view or initial project load)
        if (initialStyleName) {
            styleToSelect = availableStyles.find(s => s.style_name === initialStyleName);
        }
    
        // Priority 2: A style was previously selected for this project (from localStorage)
        if (!styleToSelect) {
            try {
                const savedStyles: Record<string, string> = JSON.parse(localStorage.getItem('rosi-decora-selected-styles') || '{}');
                const savedStyleName = savedStyles[project.id];
                if (savedStyleName) {
                    styleToSelect = availableStyles.find(s => s.style_name === savedStyleName);
                }
            } catch (e) {
                console.error("Error reading saved styles from localStorage", e);
            }
        }
    
        // Priority 3: Fallback to the first *available* style variation
        if (!styleToSelect) {
            styleToSelect = availableStyles[0];
        }
    
        // Only update state if the new style is different from the current one to avoid unnecessary re-renders
        if (styleToSelect && styleToSelect.style_name !== selectedStyle?.style_name) {
            setSelectedStyle(styleToSelect);
            // Cuando se cambia el estilo, también se resetea el índice de la iteración a la última
            // para que los botones de deshacer/rehacer tengan un estado inicial limpio.
            setCurrentIterationIndex(styleToSelect.iterations.length);
        }
    // This effect should run when project.styleVariations changes (e.g., new styles arrive from streaming)
    // and also when the project.id changes (new project loaded).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project.id, project.styleVariations, initialStyleName]); // Added project.styleVariations as dependency

    // Effect to auto-save the selected style to localStorage and reset the iteration view when it changes.
    useEffect(() => {
        if (selectedStyle) {
            // Auto-save the current selection to localStorage
            try {
                const savedStyles: Record<string, string> = JSON.parse(localStorage.getItem('rosi-decora-selected-styles') || '{}');
                if (savedStyles[project.id] !== selectedStyle.style_name) {
                    savedStyles[project.id] = selectedStyle.style_name;
                    localStorage.setItem('rosi-decora-selected-styles', JSON.stringify(savedStyles));
                }
            } catch (e) {
                console.error("Error saving selected style to localStorage", e);
            }
            
            // Cuando se selecciona un estilo, siempre mostrar la última iteración
            setCurrentIterationIndex(selectedStyle.iterations.length);
        }
    }, [selectedStyle, project.id]);

    const handleSelectIteration = useCallback((index: number) => {
        setCurrentIterationIndex(index);
    }, []);

    // handleRevertInternal eliminado, la lógica se maneja directamente en RefinementPanel con onSelectIteration

    const handleNameSave = () => {
        if (newProjectName.trim() && newProjectName.trim() !== project.name) {
            onSaveProjectName(newProjectName.trim());
        }
        setIsEditingName(false);
    };
    
    const handleFavoriteClick = () => {
      if (!selectedStyle) return;

      // Obtener el contenido de la iteración actual (o el estilo base si index es 0)
      const currentIterationContent = (currentIterationIndex === selectedStyle.iterations.length)
          ? selectedStyle // Contenido del estilo original (cuando currentIterationIndex apunta al final)
          : selectedStyle.iterations[currentIterationIndex]; // Contenido de una iteración específica
      
      if (!currentIterationContent) return;

      // Crear una copia del StyleVariation o Iteration para guardar en favoritos
      const designSnapshot: StyleVariation = {
          ...JSON.parse(JSON.stringify(currentIterationContent)), // Clonar para evitar mutaciones directas
          style_name: selectedStyle.style_name, // Asegurarse de que el nombre del estilo sea el del selectedStyle
          iterations: [], // Los favoritos no guardan historial de iteraciones
          comments: [], // Los favoritos no guardan comentarios específicos de la variación
      };
      
      onFavorite(designSnapshot, project.id, project.name);
    };

    const handleShare = async (imageUrl: string | null, styleName: string) => {
        if (!imageUrl) {
            alert("No hay imagen para compartir.");
            return;
        }
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `${project.name}-${styleName}.png`, { type: blob.type });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `Tu diseño de ${project.name} - Estilo ${styleName}`,
                    text: `Mira este diseño que has creado con la ayuda de tu universo de sueños.`, // Ajustado
                    files: [file],
                });
            } else {
                 alert("Tu navegador no soporta compartir archivos directamente. Intenta desde un dispositivo móvil.");
            }
        } catch (err) {
            console.error('Error al compartir: ', err);
            alert("Ocurrió un error al intentar compartir la imagen.");
        }
    };
    
    const handleSaveCommentInternal = (text: string) => {
        if (selectedStyle) {
            onSaveComment(project.id, selectedStyle.style_name, text);
        }
    };

    const handleGenerateStoryClick = () => {
        if (selectedStyle?.imageBase64?.data && selectedStyle.style_name && project.analysis) {
            onGenerateStory(selectedStyle.imageBase64, selectedStyle.style_name, project.analysis);
        } else {
            alert("No hay imagen para generar una historia.");
        }
    };

    const displayContent = useMemo(() => {
        if (!selectedStyle) return { imageUrl: project.originalImage, description: '', palette: [], furniture_recommendations: [] as Furniture[], currentImageBase64: null };

        // El índice `selectedStyle.iterations.length` representa el estado inicial del estilo (sin iteraciones aplicadas).
        // Las iteraciones se indexan desde 0.
        const allContent = [
            {
                imageUrl: selectedStyle.imageUrl,
                imageBase64: selectedStyle.imageBase64,
                description: selectedStyle.description,
                color_palette: selectedStyle.color_palette,
                furniture_recommendations: selectedStyle.furniture_recommendations,
            },
            ...selectedStyle.iterations.map(iter => ({
                imageUrl: iter.imageUrl,
                imageBase64: iter.imageBase64,
                description: iter.description,
                color_palette: iter.color_palette,
                furniture_recommendations: iter.furniture_recommendations,
            })),
        ];

        // currentIterationIndex 0 se refiere al estado inicial, 1 a la primera iteración, etc.
        // Si currentIterationIndex es igual a allContent.length, significa que estamos en la última iteración
        // o en el estado "original" si no hay iteraciones.
        const currentDisplay = allContent[currentIterationIndex];

        return {
            imageUrl: currentDisplay.imageUrl,
            description: currentDisplay.description,
            palette: currentDisplay.color_palette,
            furniture_recommendations: currentDisplay.furniture_recommendations,
            currentImageBase64: currentDisplay.imageBase64,
        };
    }, [selectedStyle, currentIterationIndex, project.originalImage]);

    const comparatorBeforeImage = useMemo(() => {
        if (!selectedStyle) return project.originalImage; 
        
        // Si currentIterationIndex es 0, el "antes" es la imagen original del proyecto.
        if (currentIterationIndex === 0) {
            return project.originalImage;
        } 
        // Si currentIterationIndex > 0, el "antes" es la imagen de la iteración anterior (currentIterationIndex - 1).
        else if (currentIterationIndex > 0 && selectedStyle.iterations[currentIterationIndex - 1]) {
            return selectedStyle.iterations[currentIterationIndex - 1].imageUrl;
        }
        // Fallback: si no hay iteraciones y no es el original, debería ser la imagen base del estilo.
        // Esto cubrirá el caso donde currentIterationIndex es 0 pero ya hay iteraciones y queremos comparar el estilo base con la primera.
        return selectedStyle.imageUrl; 
    }, [project.originalImage, selectedStyle, currentIterationIndex]);

    // NEW: Logic for generating next style
    const allStylesGenerated = project.styleVariations.length === ALL_STYLES.length;
    const nextStyleName = ALL_STYLES.find(
        style => !project.styleVariations.some(sv => sv.style_name === style)
    );

    const handleGenerateNextStyleClick = async () => {
        if (!nextStyleName || isGeneratingSingleStyle) return;
        setIsGeneratingSingleStyle(true);
        setGeneratedStyleErrors(prev => ({ ...prev, [nextStyleName]: null })); // Clear previous error
        try {
            await onGenerateNextStyle(project.id);
        } catch (error: any) {
            console.error(`Error generating style ${nextStyleName}:`, error);
            setGeneratedStyleErrors(prev => ({ ...prev, [nextStyleName]: error.message || "Error desconocido" }));
        } finally {
            setIsGeneratingSingleStyle(false);
        }
    };


    type TabItem = { label: string; content: React.ReactNode };
    const tabs: TabItem[] = [
        { label: 'Inspiración', content: <p className="text-text-color-soft">{displayContent.description}</p> },
        { label: 'De Compras', content: displayContent.furniture_recommendations && displayContent.furniture_recommendations.length > 0 ? <FurnitureList furniture={displayContent.furniture_recommendations} /> : <p className="text-text-color-soft">Aún no se han encontrado tesoros para este estilo. ¡Sigue explorando!</p> },
        { label: 'Colores', content: displayContent.palette && displayContent.palette.length > 0 ? <ColorPalette palette={displayContent.palette} /> : <p className="text-text-color-soft">No hay una paleta de colores definida para este estilo.</p> },
    ];

    return (
        <div className="container mx-auto">
             <div className="flex justify-center items-center gap-2 sm:gap-4 mb-2 group">
                {isEditingName ? (
                    <input 
                        type="text" 
                        value={newProjectName} 
                        onChange={(e) => setNewProjectName(e.target.value)} 
                        onBlur={handleNameSave}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleNameSave(); if (e.key === 'Escape') setIsEditingName(false); }}
                        className="text-3xl sm:text-4xl text-center font-bold p-2 bg-white/80 rounded-lg border-2 border-secondary-accent/50 focus:outline-none focus:ring-2 focus:ring-primary-accent transition main-title text-text-color"
                        autoFocus
                        aria-label="Editar nombre del proyecto"
                    />
                ) : (
                    <h2 className="text-3xl sm:text-4xl main-title font-bold text-center title-gradient cursor-pointer" onClick={() => setIsEditingName(true)} tabIndex={0} aria-label={`Nombre del proyecto: ${project.name}. Haz clic para editar.`}>
                        {project.name}
                    </h2>
                )}
                 <button onClick={() => setIsEditingName(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-text-color-soft hover:text-primary-accent" aria-label="Editar nombre del proyecto">
                    <EditIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
                </button>
            </div>

            <p className="text-center text-text-color-soft mb-8 text-sm sm:text-base">{project.analysis}</p>
            
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4 mb-8">
                {ALL_STYLES.map(styleName => {
                    const variation = project.styleVariations.find(v => v.style_name === styleName);
                    const phrase = stylePhrases[styleName] || REFLECTIVE_PHRASES[0]; // Fallback phrase

                    if (variation) {
                        return (
                            <StyleCard 
                                key={variation.style_name} 
                                variation={variation} 
                                isSelected={selectedStyle?.style_name === variation.style_name}
                                onSelect={() => setSelectedStyle(variation)}
                                phrase={phrase}
                            />
                        );
                    } else {
                        // Show skeleton card while waiting for generation
                        return <StyleCardSkeleton 
                                    key={styleName} 
                                    styleName={styleName} 
                                    originalImage={project.originalImage} 
                                    phrase={generatedStyleErrors[styleName] || phrase} // Show error or phrase
                                    isLoading={isGeneratingSingleStyle && nextStyleName === styleName} // Loading only if it's the current one being generated
                                />;
                    }
                })}
            </div>

            {!allStylesGenerated && (
                <div className="text-center mt-8">
                    <button
                        onClick={handleGenerateNextStyleClick}
                        disabled={isGeneratingSingleStyle || !nextStyleName}
                        className="px-8 py-4 btn-primary text-lg font-semibold shadow-xl rounded-full flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={nextStyleName ? `Generar estilo ${nextStyleName}` : "Todos los estilos generados"}
                    >
                        {isGeneratingSingleStyle ? (
                            <>
                                <SparklesIcon className="w-6 h-6 animate-spin" />
                                Tejiendo Estilo {nextStyleName}...
                            </>
                        ) : (
                            <>
                                {project.styleVariations.length === 0 ? "Generar Primer Estilo" : `Generar Siguiente Estilo: ${nextStyleName}`}
                            </>
                        )}
                    </button>
                    {generatedStyleErrors[nextStyleName!] && (
                        <p className="text-red-500 text-sm mt-2">Error al generar {nextStyleName}: {generatedStyleErrors[nextStyleName!]}</p>
                    )}
                </div>
            )}

            {selectedStyle && (
                <div className="mt-8 gradient-card p-4 sm:p-6 rounded-3xl animate-fade-in">
                    <Tabs tabs={tabs} defaultActiveTabLabel={initialActiveTabLabel} />
                </div>
            )}

            {selectedStyle ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in mt-8">
                     <div className="gradient-card p-4 sm:p-6 rounded-3xl flex flex-col gap-4">
                        <h3 className="text-3xl main-title title-gradient text-center">{selectedStyle.style_name}</h3>
                        <ImageComparator before={comparatorBeforeImage || null} after={displayContent.imageUrl || null} />
                         <div className="flex gap-4 items-center">
                            <button 
                              onClick={handleFavoriteClick} 
                              className="flex-grow flex items-center justify-center gap-2 px-4 py-3 rounded-xl btn-primary text-white font-semibold"
                              aria-label="Guardar este diseño en favoritos"
                            >
                              <DreamHeartIcon className="w-5 h-5"/> Guardar esta Joya de Diseño
                            </button>
                            <button
                                onClick={() => handleShare(displayContent.imageUrl, selectedStyle.style_name)}
                                className="p-3 rounded-xl bg-gray-200 text-text-color hover:bg-gray-300 transition-colors shadow-md hover:shadow-lg"
                                aria-label={`Compartir diseño de estilo ${selectedStyle.style_name}`}
                                title="Compartir tu inspiración"
                            >
                                <ShareIcon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleGenerateStoryClick}
                                disabled={!displayContent.currentImageBase64?.data} // Disable if current displayed content has no base64 image data
                                className="p-3 rounded-xl bg-gray-200 text-text-color hover:bg-gray-300 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Generar historia para el estilo ${selectedStyle.style_name}`}
                                title="Generar una historia sobre este diseño"
                            >
                                <BookOpenIcon className="w-6 h-6" />
                            </button>
                         </div>
                    </div>

                    <div className="gradient-card p-4 sm:p-6 rounded-3xl">
                        <RefinementPanel 
                            key={selectedStyle.style_name + project.id} // Key para forzar remount si el estilo o proyecto cambian
                            projectId={project.id}
                            styleVariation={selectedStyle} 
                            onGenerateRefinement={onGenerateRefinement} // Prop para generar preview
                            onCommitRefinement={onCommitRefinement}   // Prop para aplicar refinamiento
                            // onRevert eliminado
                            currentIterationIndex={currentIterationIndex}
                            onSelectIteration={handleSelectIteration}
                            showRefineTutorial={showRefineTutorial}
                            setShowRefineTutorial={setShowRefineTutorial}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-text-color-soft">
                    {allStylesGenerated ? (
                        <p>Todos los estilos han sido generados. ¡Explora y refina tus diseños!</p>
                    ) : (
                        <p>Haz clic en "Generar Primer Estilo" para comenzar a descubrir tu universo de sueños.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectView;