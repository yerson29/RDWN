import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Project, StyleVariation, AppView, ImageBase64, Iteration, FavoriteDesign, Furniture, ALL_STYLES, ChatMessage } from './types';
import Navigation from './components/Header';
import ImageUpload from './components/ImageUpload';
import ProjectView from './components/ProjectView';
import ArchiveView from './components/ArchiveView';
import FavoritesView from './components/FavoritesView';
import Tutorial from './components/Tutorial';
import { Modal } from './components/Modal';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { analyzeImageDetailed, generateSingleStyleVariation, refineDesign, generateStoryParagraph, regenerateStoryParagraph, chatWithGemini, regenerateAnalysis } from './services/geminiService';
import { ErrorIcon, HeartIcon, ShareIcon, ClipboardIcon, ChevronLeftIcon, ChevronRightIcon, KissIcon, SparklesIcon, MagicBookIcon, ViewIcon, DreamHeartIcon, MagicWandIcon, StarDustIcon, StarDiamondIcon, ChatIcon, CloseIcon, ImageIcon } from './components/icons/Icons';
import { initialSeedData, trendingDesignImages, REFLECTIVE_PHRASES, MOTIVATION_PHRASES, inspirationStyleImages } from './seedData';
import RefineTutorial from './components/RefineTutorial';
import { StoryModal } from './components/StoryModal';
import ReactDOM from 'react-dom';
import MobileMenu from './components/MobileMenu';
import Chatbot from './components/Chatbot';
import ImageWithFallback from './components/ImageWithFallback';
import DiaryView from './components/DiaryView';
import MotivationMessage from './components/MotivationMessage'; 

// --- State Persistence & Types ---
interface AppState {
  view: AppView;
  currentProjectId: string | null;
}

const initialAppState: AppState = {
  view: 'upload',
  currentProjectId: null,
};

// --- Constants ---
const MAGIC_PHRASES = [
    "Tejiendo diseños con hilos de luz para tu espacio.",
    "Cada píxel, un susurro de magia para tu hogar.",
    "Despertando la belleza latente en cada rincón.",
    "Orquestando la sinfonía visual de tus deseos.",
    "Donde la inspiración se encuentra con el diseño.",
    "Modelando espacios que cantan con tu esencia.",
    "La decoración que tu corazón anhela, ahora digital.",
    "Construyendo puentes entre tu imaginación y la realidad.",
    "Transformando lo ordinario en extraordinario con un clic.",
    "Tu futuro hogar, un lienzo esperando tu arte.",
    "El diseño es magia, y tú eres la maga.",
    "Visualizando un mañana más hermoso, para ti.",
    "La magia que se programa para ti",
    "El encanto que se crea para tu futuro",
    "Este hechizo de diseño que se codifica solo para ti",
    "El universo de ideas que se diseña para ti",
    "Este motor de inspiración que se construye para tu sonrisa",
    "Un algoritmo de inspiración, calculado para tu felicidad",
    "La arquitectura de tu futuro, renderizada para ti",
    "Compilando los píxeles de tu próximo espacio soñado",
    "Cada línea de código es una chispa para tus diseños",
    "Tu inspiración, la constante que hace que todo fluya",
    "Que tu espacio sea un eco de tu alma.",
    "Con cada trazo, una nueva historia para tu hogar.",
    "Diseñando para la alegría, creando para la vida.",
    "Tu visión, el blueprint de la belleza.",
    "La estética es el lenguaje de tu espíritu.",
    "Un espacio transformado, un corazón inspirado.",
    "Donde la creatividad no tiene límites, tu estilo es eterno.", // Ajustado para Rosi es usuaria
    "Cada rincón cuenta una historia. ¿Cuál será la tuya hoy?",
    "Más allá de la decoración, la creación de tu santuario.",
    "Un suspiro de diseño, un mundo de posibilidades.",
    "Tu hogar, tu lienzo. Tu vida, tu obra maestra.",
    "Despertando emociones a través de la forma y el color.",
    "La magia sucede cuando el diseño se encuentra contigo.",
    "Creando atmósferas que susurran tu nombre.",
    "Tu espacio es un reflejo de tu espíritu. ¡Hazlo brillar!",
    "Cada decisión, un paso hacia tu hogar ideal.",
    "La armonía perfecta espera tu toque.",
    "Donde la luz y la sombra bailan con tu estilo.",
    "El arte de vivir, diseñado por ti.",
    "Crea un mundo donde cada detalle te sonría.",
    "Tu creatividad es el pincel, tu hogar el lienzo.",
    "Un refugio que cuenta tu historia."
];

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(initialAppState);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [favorites, setFavorites] = useState<FavoriteDesign[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Only for initial image analysis
    const [analysisForLoader, setAnalysisForLoader] = useState<string | null>(null); // New state for loader's text
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [hasSelectedApiKey, setHasSelectedApiKey] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [isConfirmDeleteFavoriteOpen, setIsConfirmDeleteFavoriteOpen] = useState(false);
    const [favoriteToDelete, setFavoriteToDelete] = useState<string | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showRefineTutorial, setShowRefineTutorial] = useState(false); 
    const [magicPhrase, setMagicPhrase] = useState('');
    const [currentTrendingImageIndex, setCurrentTrendingImageIndex] = useState(0);
    const [storyModalOpen, setStoryModalOpen] = useState(false);
    const [currentStory, setCurrentStory] = useState<string | null>(null);
    const [selectedStyleForStory, setSelectedStyleForStory] = useState<string | null>(null);
    const [currentProjectForStory, setCurrentProjectForStory] = useState<Project | null>(null);
    const [isStoryLoading, setIsStoryLoading] = useState(false);
    const [storyChatHistory, setStoryChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [chatbotHistory, setChatbotHistory] = useState<ChatMessage[]>([]); 
    const [isChatbotSending, setIsChatbotSending] = useState(false);
    const [showBillingDisclaimer, setShowBillingDisclaimer] = useState(false);
    const [motivationMessage, setMotivationMessage] = useState<string | null>(null); 
    const [isAnalysisRegenerating, setIsAnalysisRegenerating] = useState(false);

    // New states for background style generation
    const [isGeneratingBackgroundStyles, setIsGeneratingBackgroundStyles] = useState(false);
    const [stylesInQueue, setStylesInQueue] = useState<string[]>([]); // Styles waiting to be generated for the current project
    const [currentlyGeneratingStyle, setCurrentlyGeneratingStyle] = useState<string | null>(null);
    const [styleGenerationErrors, setStyleGenerationErrors] = useState<Record<string, string | null>>({});

    // Store the initial style name and tab label when navigating to ProjectView
    const initialStyleNameForProjectView = useRef<string | undefined>(undefined);
    const initialTabLabelForProjectView = useRef<string | undefined>(undefined);
    
    // Ref para el proyecto más reciente, útil para actualizaciones de streaming
    const latestProjectRef = useRef<Project | null>(null);

    // Simulated API Key check for Veo models
    useEffect(() => {
        const checkApiKey = async () => {
            setHasSelectedApiKey(true); // Assume API key is available for current models
        };
        checkApiKey();
    }, []);

    // Loader phrase & image rotation effect
    useEffect(() => {
        let phraseInterval: number | undefined;
        let imageInterval: number | undefined;

        if (isLoading) {
            const updatePhrases = () => {
                const randomMagic = MAGIC_PHRASES[Math.floor(Math.random() * MAGIC_PHRASES.length)];
                setMagicPhrase(randomMagic);
            };

            updatePhrases();

            phraseInterval = window.setInterval(updatePhrases, 3000); // Update phrases every 3 seconds
            imageInterval = window.setInterval(() => {
                setCurrentTrendingImageIndex(prevIndex => (prevIndex + 1) % trendingDesignImages.length);
            }, 3000); // Rotate image every 3 seconds

            return () => {
                if (phraseInterval) window.clearInterval(phraseInterval);
                if (imageInterval) window.clearInterval(imageInterval);
            };
        }
    }, [isLoading]); 

    // State persistence
    useEffect(() => {
        const savedAppState = localStorage.getItem('rosi-decora-app-state');
        if (savedAppState) setAppState(JSON.parse(savedAppState));

        const savedProjects = localStorage.getItem('rosi-decora-projects');
        if (savedProjects) setAllProjects(JSON.parse(savedProjects));
        else setAllProjects(initialSeedData.projects);

        const savedFavorites = localStorage.getItem('rosi-decora-favorites');
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        else setFavorites(initialSeedData.favorites);

        const hasSeenDisclaimer = sessionStorage.getItem('rosi-decora-billing-disclaimer-seen');
        if (!hasSeenDisclaimer) {
            setShowBillingDisclaimer(true);
            sessionStorage.setItem('rosi-decora-billing-disclaimer-seen', 'true'); 
        }

    }, []);

    useEffect(() => {
        localStorage.setItem('rosi-decora-app-state', JSON.stringify(appState));
    }, [appState]);

    useEffect(() => {
        localStorage.setItem('rosi-decora-projects', JSON.stringify(allProjects));
    }, [allProjects]);

    useEffect(() => {
        localStorage.setItem('rosi-decora-favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Error handling
    const handleError = (error: any) => {
        console.error("Global error caught:", error);
        let msg = "Un hechizo inesperado ha interrumpido la magia. Por favor, inténtalo de nuevo.";
        if (error instanceof Error) {
            msg = error.message;
        } else if (typeof error === 'string') {
            msg = error;
        } else if (error.promptFeedback?.blockReason) {
             msg = `La magia fue bloqueada. Razón: ${error.promptFeedback.blockReason}. Por favor, ¿intentamos con otras palabras o una imagen diferente?`;
        }
        setErrorMessage(msg);
        setIsLoading(false); 
        setAnalysisForLoader(null);
        setIsAnalysisRegenerating(false);
    };

    // --- Navigation Handlers ---
    const handleNavigate = useCallback((view: AppView, projectId: string | null = null, initialStyleName?: string, initialTabLabel?: string) => {
        setAppState({ view, currentProjectId: projectId });
        initialStyleNameForProjectView.current = initialStyleName;
        initialTabLabelForProjectView.current = initialTabLabel;
        setErrorMessage(null); // Clear errors on navigation
    }, []);

    // New centralized function to navigate and set project
    const setProjectAndNavigate = useCallback((projectId: string, initialStyleName?: string, initialTabLabel?: string) => {
        setAppState({ view: 'project', currentProjectId: projectId });
        initialStyleNameForProjectView.current = initialStyleName;
        initialTabLabelForProjectView.current = initialTabLabel;
        setErrorMessage(null);
    }, []);

    const handleTutorialClick = useCallback(() => { 
        setShowTutorial(true);
    }, []);

    const handleCloseTutorial = useCallback(() => {
        setShowTutorial(false);
    }, []);

    const handleNavigateToLatestProject = useCallback(() => {
        if (allProjects.length > 0) {
            const latestProject = [...allProjects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
            handleNavigate('project', latestProject.id);
        } else {
            setErrorMessage("Aún no tienes proyectos. ¡Sube una imagen para empezar tu magia!");
        }
    }, [allProjects, handleNavigate]);

    const handleDiaryClick = useCallback(() => {
        if (allProjects.length > 0) {
            const latestProject = [...allProjects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
            handleNavigate('diary', latestProject.id);
        } else {
            setErrorMessage("Aún no tienes proyectos. ¡Sube una imagen para empezar a escribir tu diario!");
        }
    }, [allProjects, handleNavigate]);

    const handleOpenChatbot = useCallback(() => {
        setIsChatbotOpen(true);
    }, []);

    const handleCloseChatbot = useCallback(() => {
        setIsChatbotOpen(false);
    }, []);

    // --- Background Style Generation Logic ---
    const startAutoStyleGeneration = useCallback(async (projectId: string) => {
        const getProject = () => allProjects.find(p => p.id === projectId);
        let project = getProject();
        if (!project || !project.originalImageBase64?.data) return;

        const pendingStyles = ALL_STYLES.filter(
            styleName => !project.styleVariations.some(sv => sv.style_name === styleName)
        );

        if (pendingStyles.length === 0) {
            setIsGeneratingBackgroundStyles(false);
            setStylesInQueue([]);
            setCurrentlyGeneratingStyle(null);
            return;
        }
        
        setIsGeneratingBackgroundStyles(true);
        setStylesInQueue(pendingStyles);
        setStyleGenerationErrors({});
        
        const fixedAspectRatio = '4:3'; // Hardcoded aspect ratio

        for (const styleName of pendingStyles) {
            project = getProject();
            if (!project || project.styleVariations.some(sv => sv.style_name === styleName)) continue;

            setCurrentlyGeneratingStyle(styleName);
            setStyleGenerationErrors(prev => ({ ...prev, [styleName]: null }));

            try {
                const newVariation = await generateSingleStyleVariation(
                    project.analysis,
                    styleName,
                    fixedAspectRatio
                );

                setAllProjects(prevProjects =>
                    prevProjects.map(p =>
                        p.id === projectId
                            ? { ...p, styleVariations: [...p.styleVariations, newVariation] }
                            : p
                    )
                );
            } catch (error: any) {
                console.error(`Error generando estilo ${styleName}:`, error);
                if (error.code === 'QUOTA_EXCEEDED') { // Check for custom code
                    setErrorMessage(error.message); // Display global error
                    setIsGeneratingBackgroundStyles(false); // Stop all background generation
                    setStylesInQueue([]);
                    setCurrentlyGeneratingStyle(null);
                    return; // Stop the entire process
                } else {
                    setStyleGenerationErrors(prev => ({ ...prev, [styleName]: error.message || "Error desconocido" }));
                }
            } finally {
                // Only update queue/current style if still actively generating (not stopped by quota error)
                if (isGeneratingBackgroundStyles) { // Check this flag to ensure we don't proceed if it was stopped
                    setStylesInQueue(prev => prev.filter(s => s !== styleName));
                    setCurrentlyGeneratingStyle(null);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        setIsGeneratingBackgroundStyles(false);
    }, [allProjects, setErrorMessage, isGeneratingBackgroundStyles]);

    useEffect(() => {
        if (appState.view === 'project' && appState.currentProjectId) {
            const project = allProjects.find(p => p.id === appState.currentProjectId);
            if (project && project.styleVariations.length < ALL_STYLES.length && !isGeneratingBackgroundStyles && stylesInQueue.length === 0) {
                startAutoStyleGeneration(project.id);
            }
        }
    }, [appState.view, appState.currentProjectId, allProjects, isGeneratingBackgroundStyles, stylesInQueue.length, startAutoStyleGeneration]);

    // --- Project Operations ---
    const handleImageUpload = useCallback(async (file: File) => {
        if (!hasSelectedApiKey) {
            setErrorMessage("Por favor, selecciona tu clave API para continuar.");
            return;
        }

        setIsLoading(true);
        setAnalysisForLoader(null);
        setErrorMessage(null);
        let base64Data: string | null = null;
        try {
            base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        resolve((reader.result as string).split(',')[1]);
                    } else {
                        reject(new Error("No se pudieron leer los datos del archivo."));
                    }
                };
                reader.onerror = (error) => {
                    reject(new Error(`Error al leer el archivo: ${error?.target?.error?.message || 'Error desconocido'}`));
                };
                reader.readAsDataURL(file);
            });

            if (!base64Data) {
                throw new Error("La lectura del archivo resultó en datos nulos.");
            }

            const originalImageBase64: ImageBase64 = { data: base64Data, mimeType: file.type };
            const analysis = await analyzeImageDetailed(base64Data, file.type);
            setAnalysisForLoader(analysis); // Set poetic analysis for loader

            const projectId = `project-${Date.now()}`;
            const projectName = `Mi Proyecto ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}`;

            const newProject: Project = {
                id: projectId, name: projectName,
                originalImage: `data:${file.type};base64,${base64Data}`,
                originalImageBase64: originalImageBase64,
                analysis: analysis,
                styleVariations: [],
                createdAt: new Date().toISOString(),
            };
            
            setAllProjects(prev => [newProject, ...prev]);
            
            // Keep loader on, navigate after a delay to let user read analysis
            setTimeout(() => {
                setIsLoading(false);
                setAnalysisForLoader(null);
                setProjectAndNavigate(projectId);
                startAutoStyleGeneration(projectId);
            }, 4000); // 4-second delay

        } catch (error) {
            console.error("Error during image upload or analysis:", error); // Log the detailed error
            handleError(error);
        } finally {
            // Ensure isLoading is always set to false in case of any unhandled error or successful completion
            setIsLoading(false);
            setAnalysisForLoader(null);
        }
    }, [hasSelectedApiKey, setProjectAndNavigate, startAutoStyleGeneration]);

    const handleGenerateRefinement = useCallback(async (base64Data: string, mimeType: string, prompt: string, styleName: string, projectAnalysis: string) => {
        setErrorMessage(null);
        try {
            return await refineDesign(base64Data, mimeType, prompt, styleName, projectAnalysis);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);
    
    const handleRegenerateAnalysis = useCallback(async (projectId: string, userPrompt: string) => {
        const project = allProjects.find(p => p.id === projectId);
        if (!project || !project.originalImageBase64) return;
        
        setIsAnalysisRegenerating(true);
        try {
            const newAnalysis = await regenerateAnalysis(project.originalImageBase64.data, project.originalImageBase64.mimeType, userPrompt);
            setAllProjects(prev => 
                prev.map(p => p.id === projectId ? { ...p, analysis: newAnalysis } : p)
            );
        } catch (error) {
            handleError(error);
        } finally {
            setIsAnalysisRegenerating(false);
        }
    }, [allProjects]);


    const handleCommitRefinement = useCallback((projectId: string, styleName: string, prompt: string, generatedImage: ImageBase64, generatedDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'>, currentIterationIndex: number) => {
        setErrorMessage(null);
        const newIteration: Iteration = {
            prompt: prompt,
            imageUrl: generatedImage.data ? `data:${generatedImage.mimeType};base64,${generatedImage.data}` : null,
            imageBase64: generatedImage,
            description: generatedDetails.description,
            color_palette: generatedDetails.color_palette,
            furniture_recommendations: generatedDetails.furniture_recommendations,
        };

        setAllProjects(prevProjects =>
            prevProjects.map(p => {
                if (p.id === projectId) {
                    return {
                        ...p,
                        styleVariations: p.styleVariations.map(sv => {
                            if (sv.style_name === styleName) {
                                const iterationsBeforeCurrent = sv.iterations.slice(0, currentIterationIndex);
                                return { ...sv, iterations: [...iterationsBeforeCurrent, newIteration] };
                            }
                            return sv;
                        }),
                    };
                }
                return p;
            })
        );
    }, []);

    const handleSaveProjectName = useCallback((projectId: string, newName: string) => {
        setAllProjects(prev => prev.map(p => p.id === projectId ? { ...p, name: newName } : p));
    }, [allProjects]);

    const handleDeleteProject = useCallback((projectId: string) => {
        setIsConfirmDeleteOpen(true);
        setProjectToDelete(projectId);
    }, []);

    const confirmDeleteProject = useCallback(() => {
        if (projectToDelete) {
            setAllProjects(prev => prev.filter(p => p.id !== projectToDelete));
            setFavorites(prev => prev.filter(f => f.projectId !== projectToDelete));
            setIsConfirmDeleteOpen(false);
            setProjectToDelete(null);
            if (appState.currentProjectId === projectToDelete) {
                handleNavigate('archive');
            }
        }
    }, [projectToDelete, appState.currentProjectId, handleNavigate]);

    const handleSaveComment = useCallback((projectId: string, styleName: string, text: string) => {
        setAllProjects(prev => prev.map(p =>
            p.id === projectId ? { ...p, styleVariations: p.styleVariations.map(sv =>
                sv.style_name === styleName ? { ...sv, comments: [...sv.comments, { id: `comment-${Date.now()}`, text, createdAt: new Date().toISOString() }] } : sv
            )} : p
        ));
    }, [allProjects]);

    const handleFavorite = useCallback((designToFavorite: StyleVariation, projectId: string, projectName: string) => {
        const isAlreadyFavorited = favorites.some(fav => 
            fav.projectId === projectId && fav.styleVariation.style_name === designToFavorite.style_name
        );
        if (isAlreadyFavorited) {
            setErrorMessage("¡Ya tienes esta joya de diseño en tus favoritos! ✨");
            return;
        }
        const newFavorite: FavoriteDesign = {
            id: `favorite-${Date.now()}`, projectId, projectName,
            favoritedAt: new Date().toISOString(), styleVariation: designToFavorite,
        };
        setFavorites(prev => [newFavorite, ...prev]);
        const randomMotivation = MOTIVATION_PHRASES[Math.floor(Math.random() * MOTIVATION_PHRASES.length)];
        setMotivationMessage(randomMotivation);
    }, [favorites]);

    const handleDeleteFavorite = useCallback((favoriteId: string) => {
        setIsConfirmDeleteFavoriteOpen(true);
        setFavoriteToDelete(favoriteId);
    }, []);

    const confirmDeleteFavorite = useCallback(() => {
        if (favoriteToDelete) {
            setFavorites(prev => prev.filter(f => f.id !== favoriteToDelete));
            setIsConfirmDeleteFavoriteOpen(false);
            setFavoriteToDelete(null);
        }
    }, [favoriteToDelete]);

    const handleGenerateStory = useCallback(async (imageBase64: ImageBase64, styleName: string, projectAnalysis: string) => {
        setIsStoryLoading(true);
        setStoryModalOpen(true);
        setStoryChatHistory([]);
        setCurrentStory(null);
        setSelectedStyleForStory(styleName); 
        try {
            const initialStory = await generateStoryParagraph(imageBase64, styleName, projectAnalysis);
            setCurrentStory(initialStory);
            setStoryChatHistory([{ role: 'model', parts: [{ text: initialStory }] }]);
        } catch (error) {
            handleError(error);
        } finally {
            setIsStoryLoading(false);
        }
    }, []);

    const handleRegenerateStory = useCallback(async (userComment: string) => {
        if (!selectedStyleForStory || !currentProjectForStory || !currentProjectForStory.originalImageBase64) return;
        setIsStoryLoading(true);
        const newChatHistory = [...storyChatHistory, { role: 'user', parts: [{ text: userComment }] }];
        setStoryChatHistory(newChatHistory);
        try {
            const regeneratedStory = await regenerateStoryParagraph(
                newChatHistory, currentProjectForStory.originalImageBase64,
                selectedStyleForStory, currentProjectForStory.analysis
            );
            setCurrentStory(regeneratedStory);
            setStoryChatHistory(prev => [...prev, { role: 'model', parts: [{ text: regeneratedStory }] }]);
        } catch (error) {
            handleError(error);
        } finally {
            setIsStoryLoading(false);
        }
    }, [storyChatHistory, selectedStyleForStory, currentProjectForStory]);

    const handleChatbotSendMessage = useCallback(async (message: string) => {
      setIsChatbotSending(true);
      const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: message }] };
      const updatedHistory = [...chatbotHistory, newUserMessage];
      setChatbotHistory(updatedHistory);
      try {
        const responseParts = await chatWithGemini(updatedHistory); 
        setChatbotHistory(prev => [...prev, { role: 'model', parts: responseParts }]); 
      } catch (error) {
        handleError(error);
        setChatbotHistory(prev => [...prev, { role: 'model', parts: [{ text: "Lo siento, tu asistente está un poco distraída ahora mismo. Por favor, inténtalo de nuevo." }] }]);
      } finally {
        setIsChatbotSending(false);
      }
    }, [chatbotHistory]);

    const currentProject = useMemo(() => {
        return appState.currentProjectId ? allProjects.find(p => p.id === appState.currentProjectId) : null;
    }, [appState.currentProjectId, allProjects]);

    useEffect(() => {
        if (currentProject) setCurrentProjectForStory(currentProject);
    }, [currentProject]);

    const throwKiss = useCallback(() => {
        const container = document.getElementById('kiss-animation-container');
        if (!container) return;
        const kiss = document.createElement('div');
        kiss.innerHTML = '😘';
        kiss.classList.add('kiss-animation'); 
        const startX = Math.random() * (window.innerWidth / 2) + window.innerWidth / 4;
        kiss.style.left = `${startX}px`;
        kiss.style.setProperty('--random-x', Math.random().toString());
        kiss.style.setProperty('--random-duration', Math.random().toString());
        kiss.style.setProperty('--delay', `${Math.random() * 0.5}s`); 
        container.appendChild(kiss);
        kiss.addEventListener('animationend', () => kiss.remove());
    }, []);


    return (
        <div className="min-h-screen bg-background text-text-color">
            <Navigation
                currentView={appState.view}
                onNavigate={handleNavigate}
                onTutorialClick={handleTutorialClick} 
                onThrowKiss={throwKiss}
                onNavigateToLatestProject={handleNavigateToLatestProject}
                onDiaryClick={handleDiaryClick}
                onOpenChatbot={handleOpenChatbot}
                isMobileMenuOpen={isMobileMenuOpen}
                onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
            />
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onNavigate={handleNavigate}
                currentView={appState.view}
                onTutorialClick={handleTutorialClick} 
                onThrowKiss={throwKiss}
                onNavigateToLatestProject={handleNavigateToLatestProject}
                onDiaryClick={handleDiaryClick}
                onOpenChatbot={handleOpenChatbot}
            />

            <main className="p-4 sm:p-6 lg:p-8">
                {isLoading && (
                    <div className="fixed inset-0 loader-overlay-background flex flex-col items-center justify-center z-50 text-center animate-fade-in p-4">
                        <div className="loader-content flex flex-col items-center justify-center">
                            <SparklesIcon className="w-20 h-20 text-primary-accent animate-spin-slow animate-sparkle-glow mb-6" />
                            <p className="text-3xl font-bold main-title title-gradient mb-4">{magicPhrase}</p>
                            
                            {analysisForLoader ? (
                                <div className="gradient-card max-w-2xl w-full p-6 rounded-2xl animate-fade-in animate-pop-in">
                                    <h3 className="text-xl font-bold text-secondary-accent mb-2">Análisis Poético del Espacio</h3>
                                    <p className="text-lg text-text-color-soft italic">"{analysisForLoader}"</p>
                                </div>
                            ) : (
                                 <p className="text-lg text-text-color-soft italic max-w-md mb-8">Analizando el alma de tu espacio...</p>
                            )}
                            <div className="mt-8 relative w-48 h-32 rounded-lg overflow-hidden shadow-xl animate-pop-in">
                                <ImageWithFallback
                                    src={trendingDesignImages[currentTrendingImageIndex].image.data
                                        ? `data:${trendingDesignImages[currentTrendingImageIndex].image.mimeType};base64,${trendingDesignImages[currentTrendingImageIndex].image.data}`
                                        : null}
                                    alt={trendingDesignImages[currentTrendingImageIndex].name}
                                    className="w-full h-full object-cover"
                                    fallbackIconClassName="w-1/2 h-1/2"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <p className="text-white text-md font-semibold animate-fade-in-out">
                                        {trendingDesignImages[currentTrendingImageIndex].name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 flex items-center gap-2 error-message-card animate-pop-in" role="alert">
                        <ErrorIcon className="w-6 h-6 flex-shrink-0" />
                        <span className="block sm:inline">{errorMessage}</span>
                        <button onClick={() => setErrorMessage(null)} className="ml-auto p-1 rounded-full hover:bg-red-200 transition-colors" aria-label="Cerrar alerta de error">
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {showTutorial && <Tutorial onClose={handleCloseTutorial} />}
                {storyModalOpen && currentStory && selectedStyleForStory && currentProjectForStory && (
                    <StoryModal
                        isOpen={storyModalOpen}
                        onClose={() => setStoryModalOpen(false)}
                        story={currentStory}
                        storyStyleName={selectedStyleForStory}
                        chatHistory={storyChatHistory}
                        onRegenerate={handleRegenerateStory}
                        isLoading={isStoryLoading}
                    />
                )}
                {isChatbotOpen && (
                    <Chatbot
                        isOpen={isChatbotOpen}
                        onClose={handleCloseChatbot}
                        chatHistory={chatbotHistory}
                        onSendMessage={handleChatbotSendMessage}
                        isSending={isChatbotSending}
                    />
                )}
                {motivationMessage && (
                    <MotivationMessage
                        message={motivationMessage}
                        onClose={() => setMotivationMessage(null)}
                    />
                )}

                <>
                    {appState.view === 'upload' && (
                        <ImageUpload
                            onImageUpload={handleImageUpload}
                            recentProjects={allProjects.slice(0, 4)} 
                            onViewProject={(id) => handleNavigate('project', id)}
                        />
                    )}
                    {appState.view === 'project' && currentProject && (
                        <ProjectView
                            project={currentProject}
                            initialStyleName={initialStyleNameForProjectView.current}
                            initialActiveTabLabel={initialTabLabelForProjectView.current}
                            onGenerateRefinement={handleGenerateRefinement} 
                            onCommitRefinement={handleCommitRefinement}   
                            onFavorite={handleFavorite}
                            onSaveProjectName={(newName) => handleSaveProjectName(currentProject.id, newName)}
                            onSaveComment={handleSaveComment} 
                            onGenerateStory={handleGenerateStory}
                            onRegenerateAnalysis={(prompt) => handleRegenerateAnalysis(currentProject.id, prompt)}
                            isAnalysisRegenerating={isAnalysisRegenerating}
                            showRefineTutorial={showRefineTutorial} 
                            setShowRefineTutorial={setShowRefineTutorial} 
                            isGeneratingBackgroundStyles={isGeneratingBackgroundStyles}
                            currentlyGeneratingStyle={currentlyGeneratingStyle}
                            styleGenerationErrors={styleGenerationErrors}
                        />
                    )}
                    {appState.view === 'archive' && (
                        <ArchiveView
                            projects={allProjects}
                            onView={(id) => handleNavigate('project', id)}
                            onDelete={handleDeleteProject}
                            onNavigate={(view) => handleNavigate(view)}
                        />
                    )}
                    {appState.view === 'favorites' && (
                        <FavoritesView
                            favorites={favorites}
                            onView={(projectId, styleName) => handleNavigate('project', projectId, styleName)}
                            onDelete={handleDeleteFavorite}
                            onNavigateToUpload={() => handleNavigate('upload')}
                        />
                    )}
                    {appState.view === 'diary' && currentProject && (
                        <DiaryView
                            project={currentProject}
                            onNavigateBack={() => handleNavigate('project', currentProject.id)}
                            onSaveComment={handleSaveComment} 
                        />
                    )}
                </>
            </main>

            <ConfirmationDialog
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={confirmDeleteProject}
                title="¿Estás segura?"
                message="Este proyecto se desvanecerá para siempre. ¿Quieres continuar?"
            />
            <ConfirmationDialog
                isOpen={isConfirmDeleteFavoriteOpen}
                onClose={() => setIsConfirmDeleteFavoriteOpen(false)}
                onConfirm={confirmDeleteFavorite}
                title="¿Dejar go esta joya?"
                message="Esta joya de diseño se irá de tus favoritos. ¿Quieres continuar?"
            />

            {showBillingDisclaimer && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-xl bg-gradient-to-r from-primary-accent to-secondary-accent text-white shadow-xl flex items-center gap-4 max-w-lg animate-fade-in animate-pop-in" role="alert">
                    <SparklesIcon className="w-6 h-6 flex-shrink-0 animate-sparkle-glow" />
                    <p className="text-sm">
                        ¡Atención, maga del diseño! Esta aplicación utiliza la API de Google Gemini, lo cual puede generar costos de uso.
                        Asegúrate de revisar la <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-white/80">documentación de facturación</a> para entender los cargos.
                    </p>
                    <button onClick={() => setShowBillingDisclaimer(false)} className="ml-auto btn-solid-icon btn-solid-icon-red w-8 h-8 p-0" aria-label="Cerrar aviso de facturación">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;