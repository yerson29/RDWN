import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Project, StyleVariation, Furniture, ImageBase64, Comment } from '../types';
import { RefinementPanel } from './RefinementPanel';
import FurnitureList from './FurnitureList';
import ImageWithFallback from './ImageWithFallback';
import { DreamHeartIcon, ShareIcon, EditIcon, ClipboardIcon, ChevronLeftIcon, ChevronRightIcon, CommentIcon as DiaryIcon, BookOpenIcon, StarDustIcon, SparklesIcon, MagicWandIcon, CheckIcon, CloseIcon } from './icons/Icons';
import VoiceInputButton from './VoiceInputButton';
import { ALL_STYLES } from '../types';
import { REFLECTIVE_PHRASES } from '../seedData'; 
import { ImageComparator, Tabs, ColorPalette } from './UtilityComponents';


// --- SUB-COMPONENTS ---

const OriginalImageDisplay: React.FC<{
  project: Project;
  isEditingName: boolean;
  newProjectName: string;
  isAnalysisRegenerating: boolean;
  onEditName: () => void;
  onSaveName: () => void;
  onCancelName: () => void;
  onNameChange: (name: string) => void;
  onRegenerateAnalysis: (prompt: string) => void;
}> = ({
  project, isEditingName, newProjectName, isAnalysisRegenerating,
  onEditName, onSaveName, onCancelName, onNameChange, onRegenerateAnalysis
}) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisPrompt, setAnalysisPrompt] = useState('');
    
    const handleRegenerateClick = () => {
        if (analysisPrompt.trim() && !isAnalysisRegenerating) {
            onRegenerateAnalysis(analysisPrompt); // FIX: Pass only the prompt, projectId is handled by closure
            setAnalysisPrompt('');
            setIsAnalyzing(false);
        }
    }

    return (
        <div className="gradient-card p-4 sm:p-6 rounded-3xl flex flex-col gap-4 animate-pop-in">
            <h3 className="text-3xl main-title title-gradient text-center">Tu Lienzo Original</h3>
            <ImageWithFallback src={project.originalImage} alt="Tu espacio original" className="w-full aspect-video object-cover rounded-xl shadow-md" loading="eager" />
            
            <div className="flex justify-center items-center gap-2 group mt-2">
                {isEditingName ? (
                    <>
                        <input 
                            type="text" value={newProjectName} 
                            onChange={(e) => onNameChange(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') onSaveName(); if (e.key === 'Escape') onCancelName(); }}
                            className="text-xl text-center font-bold p-2 bg-white/80 rounded-lg border-2 border-secondary-accent/50 focus:outline-none focus:ring-2 focus:ring-primary-accent transition main-title text-text-color"
                            autoFocus aria-label="Editar nombre del proyecto"
                        />
                        <button onClick={onSaveName} className="btn-solid-icon btn-solid-icon-green" aria-label="Guardar nombre"><CheckIcon className="w-6 h-6"/></button> {/* Using btn-solid-icon-green */}
                        <button onClick={onCancelName} className="btn-solid-icon btn-solid-icon-red" aria-label="Cancelar edición"><CloseIcon className="w-6 h-6"/></button> {/* Using btn-solid-icon-red */}
                    </>
                ) : (
                    <>
                        <h2 className="text-xl main-title font-bold text-center title-gradient cursor-pointer" onClick={onEditName} tabIndex={0} aria-label={`Nombre del proyecto: ${project.name}. Haz clic para editar.`}>
                            {project.name}
                        </h2>
                        <button onClick={onEditName} className="opacity-0 group-hover:opacity-100 btn-solid-icon btn-solid-icon-purple w-8 h-8 p-1" aria-label="Editar nombre del proyecto"> {/* Using btn-solid-icon */}
                            <EditIcon className="w-5 h-5"/>
                        </button>
                    </>
                )}
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl text-center shadow-inner">
                <h4 className="text-lg font-bold text-secondary-accent mb-1">Análisis Poético</h4>
                <p className="text-text-color italic text-sm">"{project.analysis}"</p> {/* Changed text color for clarity */}
                <button onClick={() => setIsAnalyzing(!isAnalyzing)} className="text-xs text-primary-accent hover:underline mt-3 transition-colors transform hover:scale-105">
                    {isAnalyzing ? 'Cancelar' : 'Pedir nuevo análisis'}
                </button>
                {isAnalyzing && (
                    <div className="mt-3 flex flex-col items-center gap-2 animate-fade-in animate-pop-in">
                         <div className="relative w-full max-w-sm">
                            <textarea
                                value={analysisPrompt}
                                onChange={(e) => setAnalysisPrompt(e.target.value)}
                                placeholder="¿Qué perspectiva buscas? Ej: 'más místico', 'más juguetón'..."
                                className="w-full p-2 border rounded-lg pr-10 bg-white/80 text-sm focus:ring-2 focus:ring-primary-accent transition main-title text-text-color"
                                rows={2}
                                disabled={isAnalysisRegenerating}
                            />
                            <VoiceInputButton onResult={setAnalysisPrompt} />
                        </div>
                        <button onClick={handleRegenerateClick} className="px-4 py-2 btn-pill-base btn-main-action text-sm rounded-lg flex items-center gap-2 transform hover:scale-105 transition-transform" disabled={isAnalysisRegenerating}>
                            <div className="icon-orb"><SparklesIcon className="w-5 h-5"/></div>
                            {isAnalysisRegenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                    <span>Generando...</span>
                                </>
                            ) : <span>Regenerar</span>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const StyleCard: React.FC<{ variation: StyleVariation; onSelect: () => void; isSelected: boolean; phrase: string }> = ({ variation, onSelect, isSelected, phrase }) => {
    const latestIteration = variation.iterations.length > 0 ? variation.iterations[variation.iterations.length - 1] : null;
    const displayImage = latestIteration?.imageUrl || variation.imageUrl || null;

    return (
        <div 
            className={`gradient-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-primary-accent scale-105 shadow-xl' : 'hover:scale-[1.02] hover:shadow-lg'}`}
            onClick={onSelect}
            aria-label={`Seleccionar estilo ${variation.style_name}`}
            role="button"
            tabIndex={0}
        >
            <ImageWithFallback 
                src={displayImage} 
                alt={variation.style_name} 
                className="w-full h-24 sm:h-32 object-cover animate-fade-in" 
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

const StyleCardSkeleton: React.FC<{ styleName: string; originalImage: string | null; phrase: string; isLoading?: boolean; error?: string | null }> = ({ styleName, originalImage, phrase, isLoading = false, error }) => (
    <div className="gradient-card rounded-2xl overflow-hidden animate-fade-in">
        <div className="relative w-full h-24 sm:h-32">
            <ImageWithFallback
                src={originalImage} 
                alt="Cargando estilo..."
                className="w-full h-full object-cover blur-sm brightness-75" 
                fallbackIconClassName="w-1/2 h-1/2"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2">
                 {isLoading && <SparklesIcon className="w-8 h-8 border-4 border-dashed rounded-full animate-spin-slow animate-sparkle-glow border-white mb-2" />}
                 {error ? (
                     <p className="text-red-300 text-xs text-center font-semibold animate-fade-in">¡Error!</p>
                 ) : (
                    <p className="text-white text-xs text-center font-semibold animate-fade-in-out">{phrase}</p>
                 )}
            </div>
        </div>
        <div className="p-3">
             <h3 className="text-sm sm:text-base font-bold text-text-color truncate">{styleName}</h3>
        </div>
    </div>
);


// --- MAIN COMPONENT ---

interface ProjectViewProps {
  project: Project;
  initialStyleName?: string;
  onGenerateRefinement: (base64Data: string, mimeType: string, prompt: string, styleName: string, projectAnalysis: string) => Promise<{ newImage: ImageBase64; newDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'> }>; 
  onCommitRefinement: (projectId: string, styleName: string, prompt: string, generatedImage: ImageBase64, generatedDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'>, currentIterationIndex: number) => void; 
  onFavorite: (designToFavorite: StyleVariation, projectId: string, projectName: string) => void;
  onSaveProjectName: (newName: string) => void;
  onSaveComment: (projectId: string, styleName: string, text: string) => void;
  onGenerateStory: (imageBase64: ImageBase64, styleName: string, projectAnalysis: string) => void;
  onRegenerateAnalysis: (userPrompt: string) => void;
  isAnalysisRegenerating: boolean;
  initialActiveTabLabel?: string; 
  showRefineTutorial: boolean; 
  setShowRefineTutorial: React.Dispatch<React.SetStateAction<boolean>>; 
  isGeneratingBackgroundStyles: boolean;
  currentlyGeneratingStyle: string | null;
  styleGenerationErrors: Record<string, string | null>;
}

const ProjectView: React.FC<ProjectViewProps> = ({ 
    project, initialStyleName, onGenerateRefinement, onCommitRefinement, onFavorite, onSaveProjectName, onSaveComment, onGenerateStory, onRegenerateAnalysis, isAnalysisRegenerating, initialActiveTabLabel, showRefineTutorial, setShowRefineTutorial,
    isGeneratingBackgroundStyles, currentlyGeneratingStyle, styleGenerationErrors 
}) => {
    const [selectedStyle, setSelectedStyle] = useState<StyleVariation | null>(null);
    const [currentIterationIndex, setCurrentIterationIndex] = useState(0);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newProjectName, setNewProjectName] = useState(project.name);

    const stylePhrases = useMemo(() => {
        const phrasesMap: Record<string, string> = {};
        ALL_STYLES.forEach(styleName => {
            phrasesMap[styleName] = REFLECTIVE_PHRASES[Math.floor(Math.random() * REFLECTIVE_PHRASES.length)];
        });
        return phrasesMap;
    }, [project.id]); 

    useEffect(() => {
        const availableStyles = project.styleVariations;
        if (availableStyles.length === 0) {
            setSelectedStyle(null); 
            return; 
        }
        let styleToSelect: StyleVariation | undefined;
        if (initialStyleName) {
            styleToSelect = availableStyles.find(s => s.style_name === initialStyleName);
        }
        if (!styleToSelect) {
            try {
                const savedStyles: Record<string, string> = JSON.parse(localStorage.getItem('rosi-decora-selected-styles') || '{}');
                const savedStyleName = savedStyles[project.id];
                if (savedStyleName) {
                    styleToSelect = availableStyles.find(s => s.style_name === savedStyleName);
                }
            } catch (e) { console.error("Error reading saved styles", e); }
        }
        if (!styleToSelect) {
            styleToSelect = availableStyles[0];
        }
        if (styleToSelect && styleToSelect.style_name !== selectedStyle?.style_name) {
            setSelectedStyle(styleToSelect);
            setCurrentIterationIndex(0); // Start at base image for the selected style
        }
    }, [project.id, project.styleVariations, initialStyleName, selectedStyle]);

    useEffect(() => {
        if (selectedStyle) {
            try {
                const savedStyles: Record<string, string> = JSON.parse(localStorage.getItem('rosi-decora-selected-styles') || '{}');
                if (savedStyles[project.id] !== selectedStyle.style_name) {
                    savedStyles[project.id] = selectedStyle.style_name;
                    localStorage.setItem('rosi-decora-selected-styles', JSON.stringify(savedStyles));
                }
            } catch (e) { console.error("Error saving selected style", e); }
            setCurrentIterationIndex(0);
        }
    }, [selectedStyle, project.id]);
    
    useEffect(() => {
        // When a new iteration is added, jump to it
        if (selectedStyle) {
            setCurrentIterationIndex(selectedStyle.iterations.length);
        }
    }, [selectedStyle?.iterations.length]);

    const handleNameSave = () => {
        if (newProjectName.trim() && newProjectName.trim() !== project.name) {
            onSaveProjectName(newProjectName.trim());
        }
        setIsEditingName(false);
    };
    
    const handleFavoriteClick = () => {
      if (!selectedStyle) return;
      const allContent = [selectedStyle, ...selectedStyle.iterations];
      const currentContent = allContent[currentIterationIndex];
      if (!currentContent) return;

      const designSnapshot: StyleVariation = {
          ...JSON.parse(JSON.stringify(currentContent)), 
          style_name: selectedStyle.style_name, 
          iterations: [], comments: [], 
          imageUrl: currentContent.imageUrl,
          imageBase64: currentContent.imageBase64
      };
      
      onFavorite(designSnapshot, project.id, project.name);
    };

    const handleShare = async (imageUrl: string | null, styleName: string) => {
        if (!imageUrl) return;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `${project.name}-${styleName}.png`, { type: blob.type });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `Mi diseño de ${project.name} - Estilo ${styleName}`,
                    text: `Mira este diseño que he creado con Rosi Decora.`, 
                    files: [file],
                });
            } else {
                 alert("Tu navegador no soporta compartir archivos directamente.");
            }
        } catch (err) {
            console.error('Error al compartir: ', err);
            alert("Ocurrió un error al intentar compartir la imagen.");
        }
    };
    
    const handleGenerateStoryClick = () => {
        if (selectedStyle?.imageBase64?.data) {
            onGenerateStory(selectedStyle.imageBase64, selectedStyle.style_name, project.analysis);
        }
    };

    const displayContent = useMemo(() => {
        if (!selectedStyle) return { imageUrl: project.originalImage, description: '', palette: [], furniture_recommendations: [] as Furniture[], currentImageBase64: null };
        const allContent = [selectedStyle, ...selectedStyle.iterations];
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
        if (currentIterationIndex === 0) return project.originalImage;
        const allContent = [selectedStyle, ...selectedStyle.iterations];
        return allContent[currentIterationIndex - 1]?.imageUrl || project.originalImage;
    }, [project.originalImage, selectedStyle, currentIterationIndex]);

    type TabItem = { label: string; content: React.ReactNode };
    const tabs: TabItem[] = [
        { label: 'Inspiración', content: <p className="text-text-color-soft">{displayContent.description}</p> },
        { label: 'De Compras', content: displayContent.furniture_recommendations?.length ? <FurnitureList furniture={displayContent.furniture_recommendations} /> : <p className="text-text-color-soft">Aún no se han encontrado tesoros para este estilo.</p> },
        { label: 'Colores', content: displayContent.palette?.length ? <ColorPalette palette={displayContent.palette} /> : <p className="text-text-color-soft">No hay una paleta de colores definida.</p> },
    ];

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <OriginalImageDisplay
                    project={project}
                    isEditingName={isEditingName}
                    newProjectName={newProjectName}
                    isAnalysisRegenerating={isAnalysisRegenerating}
                    onEditName={() => setIsEditingName(true)}
                    onSaveName={handleNameSave}
                    onCancelName={() => { setIsEditingName(false); setNewProjectName(project.name); }}
                    onNameChange={setNewProjectName}
                    onRegenerateAnalysis={onRegenerateAnalysis}
                />

                <div className="gradient-card p-4 sm:p-6 rounded-3xl animate-pop-in">
                    <h3 className="text-3xl main-title title-gradient text-center mb-4">Transformaciones Mágicas</h3>
                     <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        {ALL_STYLES.map(styleName => {
                            const variation = project.styleVariations.find(v => v.style_name === styleName);
                            const phrase = stylePhrases[styleName] || REFLECTIVE_PHRASES[0]; 
                            if (variation) {
                                return ( <StyleCard key={variation.style_name} variation={variation} isSelected={selectedStyle?.style_name === variation.style_name} onSelect={() => setSelectedStyle(variation)} phrase={phrase} /> );
                            } else {
                                return ( <StyleCardSkeleton key={styleName} styleName={styleName} originalImage={project.originalImage} phrase={styleGenerationErrors[styleName] || phrase} isLoading={currentlyGeneratingStyle === styleName} error={styleGenerationErrors[styleName]} /> );
                            }
                        })}
                    </div>
                </div>
            </div>

            {selectedStyle && (
                <div className="mt-8 gradient-card p-4 sm:p-6 rounded-3xl animate-fade-in animate-pop-in">
                    <Tabs tabs={tabs} defaultActiveTabLabel={initialActiveTabLabel} />
                </div>
            )}

            {selectedStyle ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in animate-pop-in mt-8">
                     <div className="gradient-card p-4 sm:p-6 rounded-3xl flex flex-col gap-4">
                        <h3 className="text-3xl main-title title-gradient text-center">{selectedStyle.style_name}</h3>
                        <ImageComparator before={comparatorBeforeImage || null} after={displayContent.imageUrl || null} />
                         <div className="flex gap-4 items-center">
                            <button onClick={handleFavoriteClick} className="flex-grow flex items-center justify-center gap-2 btn-pill-base btn-main-action transform hover:scale-105 transition-transform" aria-label="Guardar este diseño en favoritos">
                              <div className="icon-orb"><DreamHeartIcon className="w-5 h-5 animate-sparkle-glow"/></div> <span>Guardar Joya</span>
                            </button>
                            <button onClick={() => handleShare(displayContent.imageUrl, selectedStyle.style_name)} className="btn-solid-icon btn-solid-icon-purple" aria-label="Compartir diseño" title="Compartir"> {/* Using btn-solid-icon-purple */}
                                <ShareIcon className="w-6 h-6" />
                            </button>
                            <button onClick={handleGenerateStoryClick} disabled={!displayContent.currentImageBase64?.data} className="btn-solid-icon btn-solid-icon-purple disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Generar historia" title="Generar historia"> {/* Using btn-solid-icon-purple */}
                                <BookOpenIcon className="w-6 h-6" />
                            </button>
                         </div>
                    </div>

                    <div className="gradient-card p-4 sm:p-6 rounded-3xl">
                        <RefinementPanel 
                            key={`${selectedStyle.style_name}-${project.id}`}
                            project={project}
                            styleVariation={selectedStyle} 
                            onGenerateRefinement={onGenerateRefinement} 
                            onCommitRefinement={onCommitRefinement}   
                            currentIterationIndex={currentIterationIndex}
                            onSelectIteration={(index) => setCurrentIterationIndex(index)}
                            showRefineTutorial={showRefineTutorial} 
                            setShowRefineTutorial={setShowRefineTutorial}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-text-color-soft">
                    {isGeneratingBackgroundStyles ? (
                        <p className="flex items-center justify-center gap-2 text-xl font-semibold animate-fade-in animate-pulse">
                            <SparklesIcon className="w-6 h-6 animate-spin-slow animate-sparkle-glow" />
                            La IA está tejiendo nuevos estilos... ¡Un poco de magia y estarán listos!
                        </p>
                    ) : (
                        <p className="text-xl font-semibold animate-fade-in">Selecciona un estilo para ver su magia o espera a que se generen nuevos.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectView;