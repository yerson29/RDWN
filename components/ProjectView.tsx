import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Project, StyleVariation, Furniture, ImageBase64, Comment } from '../types';
import RefinementPanel from './RefinementPanel';
import FurnitureList from './FurnitureList';
import ImageWithFallback from './ImageWithFallback';
import { HeartIcon, ShareIcon, EditIcon, ClipboardIcon, ChevronLeftIcon, ChevronRightIcon, CommentIcon as DiaryIcon } from './icons/Icons';

// ALL_STYLES is now imported from types.ts
import { ALL_STYLES } from '../types';

// --- INLINED COMPONENTS FOR SIMPLICITY ---

// CommentsSection Component
const CommentsSection: React.FC<{ comments: Comment[]; onSaveComment: (text: string) => void; }> = ({ comments, onSaveComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onSaveComment(newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div className="mt-2">
            <h4 className="text-2xl font-bold mb-4 main-title title-gradient">Tu Diario de Ideas</h4>
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="¿Qué te susurra tu inspiración sobre este diseño?"
                    className="w-full p-3 border border-secondary-accent/50 rounded-lg bg-white text-text-color mb-3 focus:ring-2 focus:ring-primary-accent transition" // Changed bg-gray-50 to bg-white
                    rows={3}
                ></textarea>
                <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="w-full px-6 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Guardar Pensamiento
                </button>
            </form>

            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="p-4 bg-white rounded-lg border border-gray-200"> {/* Changed bg-pink-50/50 to bg-white, border-pink-100 to border-gray-200 */}
                            <p className="text-text-color whitespace-pre-wrap">{comment.text}</p> {/* Changed text-white */}
                            <p className="text-xs text-text-color-soft mt-2 text-right"> {/* Changed text-white/70 */}
                                {new Date(comment.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg"> {/* Changed border-gray-300 */}
                        <DiaryIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-text-color-soft">Aún no has capturado tus pensamientos aquí. Tu diario te espera.</p> {/* Changed text-white/70 */}
                    </div>
                )}
            </div>
        </div>
    );
};

// ImageComparator Component
const ImageComparator: React.FC<{ before: string; after: string }> = ({ before, after }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPos(percent);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const onMouseMove = (moveEvent: MouseEvent) => handleMove(moveEvent.clientX);
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const onTouchMove = (touchEvent: TouchEvent) => handleMove(touchEvent.touches[0].clientX);
        const onTouchEnd = () => {
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
    };

    return (
        <div ref={containerRef} className="image-comparator w-full aspect-video select-none rounded-xl">
            <ImageWithFallback src={after} alt="After" className="object-cover" />
            <div className="before-wrapper" style={{ width: `${sliderPos}%` }}>
                <ImageWithFallback src={before} alt="Before" className="object-cover" />
            </div>
            <div
                className="slider"
                style={{ left: `${sliderPos}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                role="slider"
                aria-label="Image comparison slider"
                aria-valuenow={sliderPos}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div className="slider-handle">
                    <span className="sr-only">Arrastrar para comparar</span>
                </div>
            </div>
        </div>
    );
};

// Tabs Component
const Tabs: React.FC<{
    tabs: { label: string; content: React.ReactNode }[];
}> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(index)}
                            className={`${
                                activeTab === index
                                    ? 'border-primary-accent text-primary-accent'
                                    : 'border-transparent text-text-color-soft hover:text-text-color hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            aria-selected={activeTab === index}
                            role="tab"
                            id={`tab-${tab.label}`}
                            aria-controls={`tabpanel-${tab.label}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            {tabs.map((tab, index) => (
                <div 
                    key={tab.label} 
                    role="tabpanel" 
                    id={`tabpanel-${tab.label}`} 
                    aria-labelledby={`tab-${tab.label}`} 
                    hidden={activeTab !== index}
                >
                    {tab.content}
                </div>
            ))}
        </div>
    );
};

// ColorPalette Component
const ColorPalette: React.FC<{ palette: string[] }> = ({ palette }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        const textToCopy = palette.join(', ');
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div>
            <div className="flex flex-wrap gap-3" role="list" aria-label="Paleta de colores del estilo">
                {palette.map((color, index) => (
                    <div key={index} className="w-12 h-12 rounded-full shadow-md border-2 border-white" style={{ backgroundColor: color }} title={color} role="listitem" aria-label={`Color ${color}`}></div>
                ))}
            </div>
            <button onClick={handleCopy} className="mt-4 flex items-center gap-2 text-sm font-semibold text-text-color hover:text-text-color-soft transition-colors" aria-live="polite"> {/* Adjusted text color */}
                <ClipboardIcon className="w-4 h-4" />
                {copied ? '¡Copiado!' : 'Copiar Paleta'}
            </button>
        </div>
    );
};

// --- MAIN COMPONENT ---

interface ProjectViewProps {
  project: Project;
  initialStyleName?: string;
  onRefine: (project: Project, styleName: string, prompt: string) => void;
  onFavorite: (designToFavorite: StyleVariation, projectId: string, projectName: string) => void;
  onRevert: (project: Project, styleName: string) => void;
  onSaveProjectName: (newName: string) => void;
  onSaveComment: (projectId: string, styleName: string, text: string) => void;
}


const StyleCard: React.FC<{ variation: StyleVariation; onSelect: () => void; isSelected: boolean }> = ({ variation, onSelect, isSelected }) => {
    const latestIteration = variation.iterations.length > 0 ? variation.iterations[variation.iterations.length - 1] : null;
    const displayImage = latestIteration ? latestIteration.imageUrl : variation.imageUrl;

    return (
        <div 
            className={`gradient-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected ? 'ring-4 ring-primary-accent scale-105' : 'hover:scale-[1.02]'}`}
            onClick={onSelect}
            aria-label={`Seleccionar estilo ${variation.style_name}`}
            role="button"
        >
            <ImageWithFallback 
                src={displayImage} 
                alt={variation.style_name} 
                className="w-full h-24 sm:h-32 object-cover" 
                fallbackIconClassName="w-1/2 h-1/2"
            />
            <div className="p-3">
                <h3 className="text-sm sm:text-base font-bold text-text-color truncate">{variation.style_name}</h3> {/* Adjusted text-white to text-text-color */}
            </div>
        </div>
    );
};

const StyleCardSkeleton: React.FC<{ styleName: string; originalImage: string }> = ({ styleName, originalImage }) => (
    <div className="gradient-card rounded-2xl overflow-hidden"> {/* Removed border-white/50 */}
        <div className="relative w-full h-24 sm:h-32">
            <ImageWithFallback
                src={originalImage}
                alt="Cargando estilo..."
                className="w-full h-full object-cover"
                fallbackIconClassName="w-1/2 h-1/2"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-primary-accent"></div>
            </div>
        </div>
        <div className="p-3">
            <h3 className="text-sm sm:text-base font-bold text-text-color truncate">{styleName}</h3> {/* Adjusted text-white to text-text-color */}
        </div>
    </div>
);


const ProjectView: React.FC<ProjectViewProps> = ({ project, initialStyleName, onRefine, onFavorite, onRevert, onSaveProjectName, onSaveComment }) => {
    const [selectedStyle, setSelectedStyle] = useState<StyleVariation | null>(null);
    const [currentIterationIndex, setCurrentIterationIndex] = useState(0);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newProjectName, setNewProjectName] = useState(project.name);

    // Effect to initialize the selected style from various sources (props, localStorage, or fallback)
    useEffect(() => {
        if (project.styleVariations.length === 0) {
            return; // Wait for variations to be loaded
        }
    
        let styleToSelect: StyleVariation | undefined;
    
        // Priority 1: A specific style name is passed in props (e.g., from favorites view)
        if (initialStyleName) {
            styleToSelect = project.styleVariations.find(s => s.style_name === initialStyleName);
        }
    
        // Priority 2: A style was previously selected for this project (from localStorage)
        if (!styleToSelect) {
            try {
                const savedStyles: Record<string, string> = JSON.parse(localStorage.getItem('rosi-decora-selected-styles') || '{}');
                const savedStyleName = savedStyles[project.id];
                if (savedStyleName) {
                    styleToSelect = project.styleVariations.find(s => s.style_name === savedStyleName);
                }
            } catch (e) {
                console.error("Error reading saved styles from localStorage", e);
            }
        }
    
        // Priority 3: Fallback to the first available style variation
        if (!styleToSelect) {
            styleToSelect = project.styleVariations[0];
        }
    
        // Only update state if the new style is different from the current one to avoid unnecessary re-renders
        if (styleToSelect && styleToSelect.style_name !== selectedStyle?.style_name) {
            setSelectedStyle(styleToSelect);
        }
    // This effect should only run when the project context changes, not on every selection change within the view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [project.id, project.styleVariations, initialStyleName]);

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
            
            // When style changes, view the latest iteration of it
            setCurrentIterationIndex(selectedStyle.iterations.length);
        }
    }, [selectedStyle, project.id]);

    const handleSelectIteration = useCallback((index: number) => {
        setCurrentIterationIndex(index);
    }, []);

    const handleRevertInternal = useCallback((styleName: string) => {
        onRevert(project, styleName);
        if (selectedStyle && currentIterationIndex === selectedStyle.iterations.length) {
            setCurrentIterationIndex(prev => Math.max(0, prev - 1));
        }
    }, [project, selectedStyle, currentIterationIndex, onRevert]);

    const handleNameSave = () => {
        if (newProjectName.trim() && newProjectName.trim() !== project.name) {
            onSaveProjectName(newProjectName.trim());
        }
        setIsEditingName(false);
    };
    
    const handleFavoriteClick = () => {
      if (!selectedStyle) return;

      const currentIteration = (currentIterationIndex === selectedStyle.iterations.length)
          ? selectedStyle
          : selectedStyle.iterations[currentIterationIndex];
      
      if (!currentIteration) return;

      const designSnapshot: StyleVariation = {
          ...JSON.parse(JSON.stringify(currentIteration)),
          style_name: selectedStyle.style_name,
          iterations: [],
          comments: [],
      };
      
      onFavorite(designSnapshot, project.id, project.name);
    };

    const handleShare = async (imageUrl: string, styleName: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `${project.name}-${styleName}.png`, { type: blob.type });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `Tu diseño de ${project.name} - Estilo ${styleName}`,
                    text: `Rosi, mira este diseño que has creado con la ayuda de tu universo de sueños.`,
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

    const displayContent = useMemo(() => {
        if (!selectedStyle) return { imageUrl: project.originalImage, description: '', palette: [], furniture_recommendations: [] };

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
        if (currentIterationIndex === 0) {
            return project.originalImage;
        } else {
            return selectedStyle.imageUrl;
        }
    }, [project.originalImage, selectedStyle, currentIterationIndex]);

    // FIX: Se añade una anotación de tipo explícita al array `tabs` para resolver el error de inferencia de tipo
    // y se eliminan comentarios en línea que podrían interferir con el parser.
    type TabItem = { label: string; content: React.ReactNode };
    const tabs: TabItem[] = [
        { label: 'Inspiración', content: <p className="text-text-color-soft">{displayContent.description}</p> },
        { label: 'Tesoros', content: displayContent.furniture_recommendations && displayContent.furniture_recommendations.length > 0 ? <FurnitureList furniture={displayContent.furniture_recommendations} /> : <p className="text-text-color-soft">Aún no se han encontrado tesoros para este estilo. ¡Sigue explorando!</p> },
        { label: 'Colores', content: displayContent.palette && displayContent.palette.length > 0 ? <ColorPalette palette={displayContent.palette} /> : <p className="text-text-color-soft">No hay una paleta de colores definida para este estilo.</p> },
        { label: 'Tu Diario', content: <CommentsSection comments={selectedStyle?.comments || []} onSaveComment={handleSaveCommentInternal} /> },
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
                        className="text-3xl sm:text-4xl text-center font-bold p-2 bg-white/80 rounded-lg border-2 border-secondary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent transition main-title text-text-color"
                        autoFocus
                        aria-label="Editar nombre del proyecto"
                    />
                ) : (
                    <h2 className="text-3xl sm:text-4xl main-title font-bold text-center title-gradient cursor-pointer" onClick={() => setIsEditingName(true)}>
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
                    if (variation) {
                        return (
                            <StyleCard 
                                key={variation.style_name} 
                                variation={variation} 
                                isSelected={selectedStyle?.style_name === variation.style_name}
                                onSelect={() => setSelectedStyle(variation)}
                            />
                        );
                    } else {
                        return <StyleCardSkeleton key={styleName} styleName={styleName} originalImage={project.originalImage} />;
                    }
                })}
            </div>

            {selectedStyle ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                     <div className="gradient-card p-4 sm:p-6 rounded-3xl flex flex-col gap-4"> {/* Removed border-white/50 */}
                        <h3 className="text-3xl main-title title-gradient text-center">{selectedStyle.style_name}</h3> {/* Centered title */}
                        <ImageComparator before={comparatorBeforeImage} after={displayContent.imageUrl} />
                         <div className="flex gap-4 items-center">
                            <button 
                              onClick={handleFavoriteClick} 
                              className="flex-grow flex items-center justify-center gap-2 px-4 py-3 rounded-xl btn-primary text-white font-semibold"
                              aria-label="Guardar este diseño en favoritos"
                            >
                              <HeartIcon className="w-5 h-5"/> Guardar esta Joya de Diseño
                            </button>
                            <button
                                onClick={() => handleShare(displayContent.imageUrl, selectedStyle.style_name)}
                                className="p-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow-lg hover:scale-105 transition-transform" /* Adjusted button styling */
                                aria-label={`Compartir diseño de estilo ${selectedStyle.style_name}`}
                                title="Compartir tu inspiración"
                            >
                                <ShareIcon className="w-6 h-6" />
                            </button>
                         </div>
                    </div>

                    <div className="gradient-card p-4 sm:p-6 rounded-3xl"> {/* Removed border-white/50 */}
                        <RefinementPanel 
                            key={selectedStyle.style_name + project.id}
                            styleVariation={selectedStyle} 
                            onRefine={(prompt) => onRefine(project, selectedStyle.style_name, prompt)}
                            onRevert={() => handleRevertInternal(selectedStyle.style_name)} 
                            currentIterationIndex={currentIterationIndex}
                            onSelectIteration={handleSelectIteration}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 text-text-color-soft"> {/* Adjusted text color */}
                    <p>Creando magia para ti, un momento...</p>
                </div>
            )}
            
            {selectedStyle && (
                <div className="mt-8 gradient-card p-4 sm:p-6 rounded-3xl animate-fade-in"> {/* Removed border-white/50 */}
                    <Tabs tabs={tabs} />
                </div>
            )}
        </div>
    );
};

export default ProjectView;