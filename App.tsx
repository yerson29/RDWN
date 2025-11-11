import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Project, StyleVariation, AppView, ImageBase64, Iteration, FavoriteDesign, Furniture, Comment, ALL_STYLES, ChatMessage } from './types';
import Navigation from './components/Header';
import ImageUpload from './components/ImageUpload';
import ProjectView from './components/ProjectView';
import ArchiveView from './components/ArchiveView';
import FavoritesView from './components/FavoritesView';
import Tutorial from './components/Tutorial';
import { Modal } from './components/Modal';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { analyzeImageDetailed, generateSingleStyleVariation, refineDesign, generateStoryParagraph, regenerateStoryParagraph, chatWithGemini } from './services/geminiService';
import { ErrorIcon, HeartIcon, ShareIcon, ClipboardIcon, ChevronLeftIcon, ChevronRightIcon, KissIcon, SparklesIcon, MagicBookIcon, ViewIcon, DreamHeartIcon, MagicWandIcon, StarDustIcon, StarDiamondIcon, ChatIcon, CloseIcon } from './components/icons/Icons';
// FIX: Se actualizan las importaciones para que coincidan con las exportaciones corregidas en seedData.ts
import { initialSeedData, trendingDesignImages, REFLECTIVE_PHRASES, MOTIVATION_PHRASES } from './seedData';
import RefineTutorial from './components/RefineTutorial';
import { StoryModal } from './components/StoryModal';
import ReactDOM from 'react-dom';
import MobileMenu from './components/MobileMenu';
import Chatbot from './components/Chatbot';
import ImageWithFallback from './components/ImageWithFallback';
import DiaryView from './components/DiaryView';
import MotivationMessage from './components/MotivationMessage'; // Nuevo componente

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
    "Tejiendo sueños con hilos de luz para tu espacio.",
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
    "Este motor de sueños que se construye para tu sonrisa",
    "Un algoritmo de inspiración, calculado para tu felicidad",
    "La arquitectura de tu futuro, renderizada para ti",
    "Compilando los píxeles de tu próximo espacio soñado",
    "Cada línea de código es una chispa para tus sueños",
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

const PHILOSOPHICAL_PHRASES = [
  "El espacio no es un vacío, sino un lienzo de posibilidades, esperando tu esencia.",
  "Cada diseño es un diálogo entre la materia y el espíritu, una forma de habitar el sueño.",
  "La belleza no reside en lo perfecto, sino en la armonía que tu corazón percibe.",
  "Un hogar es donde el alma encuentra su eco, un reflejo de la historia que anhelas contar.",
  "Diseñar es esculpir la luz, dar forma al silencio y pintar con la emoción del instante.",
  "No creamos espacios, creamos atmósferas; ecos visuales de la vida que se desea vivir.",
  "La arquitectura del alma se revela en la elección de cada color, cada textura, cada forma.",
  "En la simplicidad reside la elegancia, en la autenticidad, la verdadera belleza.",
  "Deja que tu espacio respire, que cada rincón cuente una historia de paz y pertenencia.",
  "El diseño es el puente invisible que conecta tu interior con el mundo exterior.",
  "Descubre el universo en cada detalle, la infinita posibilidad en lo ordinario.",
    "Tu entorno es una extensión de tu ser; adórnalo con la verdad de tu corazón.",
    "Más allá de la estética, la funcionalidad abraza el bienestar del alma.",
    "Cada objeto tiene un propósito, una voz silenciosa que contribuye a la sinfonía de tu hogar.",
    "La transformación de un espacio es la evolución de un espíritu. ¡Atrévete a florecer!",
    "El diseño es una meditación activa, una búsqueda consciente de la serenidad visual.",
    "La forma sigue a la emoción, creando santuarios donde el alma puede prosperar.",
    "Cierra los ojos y visualiza tu paz; abre los ojos y diseña el camino hacia ella.",
    "Un espacio diseñado con amor es un abrazo constante para quienes lo habitan.",
    "La creatividad es el pincel, tu hogar el lienzo."
];

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(initialAppState);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [favorites, setFavorites] = useState<FavoriteDesign[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [hasSelectedApiKey, setHasSelectedApiKey] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [isConfirmDeleteFavoriteOpen, setIsConfirmDeleteFavoriteOpen] = useState(false);
    const [favoriteToDelete, setFavoriteToDelete] = useState<string | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showRefineTutorial, setShowRefineTutorial] = useState(false); // NEW: State for refine tutorial
    const [philosophicalPhrase, setPhilosophicalPhrase] = useState('');
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
    const [chatbotHistory, setChatbotHistory] = useState<ChatMessage[]>([]); // Updated type
    const [isChatbotSending, setIsChatbotSending] = useState(false);
    const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>('1:1'); // Default aspect ratio
    const [showBillingDisclaimer, setShowBillingDisclaimer] = useState(false);
    const [motivationMessage, setMotivationMessage] = useState<string | null>(null); // Nuevo estado para el mensaje de motivación


    // Store the initial style name and tab label when navigating to ProjectView
    const initialStyleNameForProjectView = useRef<string | undefined>(undefined);
    const initialTabLabelForProjectView = useRef<string | undefined>(undefined);
    
    // Ref para el proyecto más reciente, útil para actualizaciones de streaming
    const latestProjectRef = useRef<Project | null>(null);

    // Simulated API Key check for Veo models
    useEffect(() => {
        const checkApiKey = async () => {
            // Only relevant if we were using Veo models that require user key selection
            // if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
            //     setHasSelectedApiKey(true);
            // } else {
            //     // Prompt user to select an API key if needed for specific models
            //     // For now, assume API_KEY is always available from environment
            //     setHasSelectedApiKey(true);
            // }
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
                const randomPhilosophical = PHILOSOPHICAL_PHRASES[Math.floor(Math.random() * PHILOSOPHICAL_PHRASES.length)];
                setPhilosophicalPhrase(randomPhilosophical);

                const randomMagic = MAGIC_PHRASES[Math.floor(Math.random() * MAGIC_PHRASES.length)];
                setMagicPhrase(randomMagic);
            };

            // Initial call to set phrases immediately
            updatePhrases();

            // Set intervals
            // FIX: Explicitly use window.setInterval to ensure `number` return type
            phraseInterval = window.setInterval(updatePhrases, 3000); // Update phrases every 3 seconds
            // FIX: Explicitly use window.setInterval to ensure `number` return type
            imageInterval = window.setInterval(() => {
                setCurrentTrendingImageIndex(prevIndex => (prevIndex + 1) % trendingDesignImages.length);
            }, 3000); // Rotate image every 3 seconds

            // Cleanup function to clear intervals
            return () => {
                // FIX: Explicitly use window.clearInterval
                if (phraseInterval) window.clearInterval(phraseInterval);
                // FIX: Explicitly use window.clearInterval
                if (imageInterval) window.clearInterval(imageInterval);
            };
        }
    }, [isLoading]); // Dependency on isLoading

    // State persistence
    useEffect(() => {
        // Load state from localStorage
        const savedAppState = localStorage.getItem('rosi-decora-app-state');
        if (savedAppState) {
            setAppState(JSON.parse(savedAppState));
        }

        const savedProjects = localStorage.getItem('rosi-decora-projects');
        if (savedProjects) {
            const parsedProjects = JSON.parse(savedProjects);
            setAllProjects(parsedProjects);
            // Initialize latestProjectRef if projects are loaded
            if (parsedProjects.length > 0) {
                latestProjectRef.current = parsedProjects.reduce((latest: Project, current: Project) =>
                    new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
                );
            }
        } else {
            setAllProjects(initialSeedData.projects);
            if (initialSeedData.projects.length > 0) {
                latestProjectRef.current = initialSeedData.projects.reduce((latest: Project, current: Project) =>
                    new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
                );
            }
        }

        const savedFavorites = localStorage.getItem('rosi-decora-favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        } else {
            setFavorites(initialSeedData.favorites);
        }

        // Show billing disclaimer once per session/visit
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
        // Update latestProjectRef whenever allProjects changes
        if (allProjects.length > 0) {
            latestProjectRef.current = allProjects.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
            );
        } else {
            latestProjectRef.current = null;
        }
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
        setIsLoading(false); // Ensure global loader is off if an error occurs
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

    const handleTutorialClick = useCallback(() => { // Renamed from handleRosiClick
        setShowTutorial(true);
    }, []);

    const handleCloseTutorial = useCallback(() => {
        setShowTutorial(false);
    }, []);

    const handleNavigateToLatestProject = useCallback(() => {
        if (allProjects.length > 0) {
            const latestProject = allProjects.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
            );
            handleNavigate('project', latestProject.id);
        } else {
            setErrorMessage("Aún no tienes proyectos. ¡Sube una imagen para empezar tu magia!");
        }
    }, [allProjects, handleNavigate]);

    const handleDiaryClick = useCallback(() => {
        if (allProjects.length > 0) {
            const latestProject = allProjects.reduce((latest, current) =>
                new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
            );
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

    // --- Project Operations ---
    const handleImageUpload = useCallback(async (file: File) => {
        if (!hasSelectedApiKey) {
            setErrorMessage("Por favor, selecciona tu clave API para continuar.");
            // if (window.aistudio) {
            //     await window.aistudio.openSelectKey();
            //     setHasSelectedApiKey(true); // Assume success for immediate retry or next action
            // }
            return;
        }

        setIsLoading(true); // <--- Sets global loader ON for initial file read & analysis
        setErrorMessage(null);
        try {
            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]); // Extract base64 part
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const originalImageBase64: ImageBase64 = { data: base64Data, mimeType: file.type };
            // Usar analyzeImageDetailed para un análisis más completo
            const analysis = await analyzeImageDetailed(base64Data, file.type); // <--- API call 1 (blocking)
            
            // --- NEW: Dismiss global loader after analysis, before navigating/streaming ---
            setIsLoading(false); // <--- Dismiss global loader here!
            // The rest of the `handleImageUpload` should now run without blocking the whole UI.

            const projectId = `project-${Date.now()}`;
            const projectName = `Mi Inspiración ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

            const newProject: Project = {
                id: projectId,
                name: projectName,
                originalImage: `data:${file.type};base64,${base64Data}`,
                originalImageBase64: originalImageBase64,
                analysis: analysis,
                styleVariations: [], // Start with empty variations
                createdAt: new Date().toISOString(),
            };

            // Set the new project and navigate to it immediately
            // Ensure project.styleVariations is an array, potentially empty for now
            setAllProjects(prev => {
                const updatedProjects = [newProject, ...prev];
                latestProjectRef.current = newProject; // Update ref immediately
                return updatedProjects;
            });
            setProjectAndNavigate(projectId); // <--- Navigates to ProjectView, which will show skeletons

            // NO INICIAR STREAMING AUTOMÁTICAMENTE AQUÍ
            
        } catch (error) {
            // If an error happens during analysis (before setIsLoading(false)), it will still show on the full-screen loader.
            // If an error happens during streaming, it will show on the ProjectView.
            handleError(error);
        }
    }, [hasSelectedApiKey, setProjectAndNavigate, aspectRatio]);

    // Nueva función para generar el siguiente estilo
    const handleGenerateNextStyle = useCallback(async (projectId: string) => {
        setErrorMessage(null);
        setIsLoading(true); // Activar el loader global temporalmente para la generación del estilo

        try {
            const projectToUpdate = allProjects.find(p => p.id === projectId);
            if (!projectToUpdate || !projectToUpdate.originalImageBase64?.data) {
                throw new Error("Proyecto no encontrado o imagen original no disponible.");
            }

            const currentStyles = projectToUpdate.styleVariations.map(sv => sv.style_name);
            const nextStyleToGenerate = ALL_STYLES.find(styleName => !currentStyles.includes(styleName));

            if (!nextStyleToGenerate) {
                console.warn("Todos los estilos ya han sido generados para este proyecto.");
                return; // Todos los estilos ya están generados
            }

            const newVariation = await generateSingleStyleVariation(
                projectToUpdate.originalImageBase64.data,
                projectToUpdate.originalImageBase64.mimeType,
                nextStyleToGenerate,
                aspectRatio
            );

            setAllProjects(prevProjects =>
                prevProjects.map(p =>
                    p.id === projectId
                        ? { ...p, styleVariations: [...p.styleVariations, newVariation] }
                        : p
                )
            );
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false); // Desactivar el loader global
        }
    }, [allProjects, aspectRatio]);

    // Nuevo: Función para generar refinamientos (solo API call, no modifica el estado)
    const handleGenerateRefinement = useCallback(async (base64Data: string, mimeType: string, prompt: string, styleName: string) => {
        setErrorMessage(null); // Clear errors for new attempt
        try {
            // Call geminiService.refineDesign directly
            const result = await refineDesign(base64Data, mimeType, prompt, styleName);
            return result; // Return the generated image and details
        } catch (error) {
            handleError(error); // This will show a global error. RefinementPanel needs to catch this
            throw error; // Re-throw to allow RefinementPanel to handle its own loading/error state
        }
    }, []);


    // Modificado: handleRefine ahora se llama handleCommitRefinement y solo actualiza el estado
    const handleCommitRefinement = useCallback((projectId: string, styleName: string, prompt: string, generatedImage: ImageBase64, generatedDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'>, currentIterationIndex: number) => {
        // setIsLoading(true); // Ya no se muestra un loader global, el RefinementPanel maneja su propio loader para el commit
        setErrorMessage(null);
        try {
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
                                    // Truncar historial si se realiza un nuevo refinamiento en una iteración anterior
                                    // Esto asegura que la acción de "rehacer" no incluya iteraciones que han sido "reemplazadas"
                                    const iterationsBeforeCurrent = sv.iterations.slice(0, currentIterationIndex + 1);
                                    return {
                                        ...sv,
                                        iterations: [...iterationsBeforeCurrent, newIteration],
                                    };
                                }
                                return sv;
                            }),
                        };
                    }
                    return p;
                })
            );
        } catch (error) {
            handleError(error);
        } finally {
            // setIsLoading(false); // No se usa loader global aquí
        }
    }, []);

    // La función handleRevert ha sido eliminada. La lógica de deshacer/rehacer se manejará con el currentIterationIndex en ProjectView y RefinementPanel.

    const handleSaveProjectName = useCallback((projectId: string, newName: string) => {
        setAllProjects(prevProjects =>
            prevProjects.map(p =>
                p.id === projectId
                    ? { ...p, name: newName }
                    : p
            )
        );
    }, []);

    const handleDeleteProject = useCallback((projectId: string) => {
        setIsConfirmDeleteOpen(true);
        setProjectToDelete(projectId);
    }, []);

    const confirmDeleteProject = useCallback(() => {
        if (projectToDelete) {
            setAllProjects(prevProjects => prevProjects.filter(p => p.id !== projectToDelete));
            setFavorites(prevFavorites => prevFavorites.filter(f => f.projectId !== projectToDelete)); // Also remove related favorites
            setIsConfirmDeleteOpen(false);
            setProjectToDelete(null);
            if (appState.currentProjectId === projectToDelete) {
                setAppState({ view: 'archive', currentProjectId: null });
            }
        }
    }, [projectToDelete, appState.currentProjectId, setAppState]);

    const handleSaveComment = useCallback((projectId: string, styleName: string, text: string) => {
        setAllProjects(prevProjects =>
            prevProjects.map(p =>
                p.id === projectId
                    ? {
                        ...p,
                        styleVariations: p.styleVariations.map(sv =>
                            sv.style_name === styleName
                                ? { ...sv, comments: [...sv.comments, { id: `comment-${Date.now()}`, text, createdAt: new Date().toISOString() }] }
                                : sv
                        ),
                    }
                    : p
            )
        );
    }, []);

    // --- Favorite Operations ---
    const handleFavorite = useCallback((designToFavorite: StyleVariation, projectId: string, projectName: string) => {
        const existingFavoriteIndex = favorites.findIndex(
            fav => fav.projectId === projectId && fav.styleVariation.style_name === designToFavorite.style_name
        );

        if (existingFavoriteIndex > -1) {
            setErrorMessage("¡Ya tienes esta joya de diseño en tus favoritos! ✨");
            return;
        }

        const newFavorite: FavoriteDesign = {
            id: `favorite-${Date.now()}`,
            projectId: projectId,
            projectName: projectName,
            favoritedAt: new Date().toISOString(),
            styleVariation: designToFavorite,
        };
        setFavorites(prev => [newFavorite, ...prev]);
        
        // Mostrar mensaje de motivación
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

    // --- Story Generation ---
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
        
        const newChatHistory = [
            ...storyChatHistory,
            { role: 'user', parts: [{ text: userComment }] }
        ];
        setStoryChatHistory(newChatHistory);

        try {
            const regeneratedStory = await regenerateStoryParagraph(
                newChatHistory,
                currentProjectForStory.originalImageBase64,
                selectedStyleForStory, 
                currentProjectForStory.analysis
            );
            setCurrentStory(regeneratedStory);
            setStoryChatHistory(prev => [...prev, { role: 'model', parts: [{ text: regeneratedStory }] }]);
        } catch (error) {
            handleError(error);
        } finally {
            setIsStoryLoading(false);
        }
    }, [storyChatHistory, selectedStyleForStory, currentProjectForStory]);

    // --- Chatbot ---
    const handleChatbotSendMessage = useCallback(async (message: string) => {
      setIsChatbotSending(true);
      const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: message }] };
      const updatedHistory = [...chatbotHistory, newUserMessage];
      setChatbotHistory(updatedHistory);

      try {
        const responseParts = await chatWithGemini(updatedHistory); // Now returns ChatMessagePart[]
        setChatbotHistory(prev => [...prev, { role: 'model', parts: responseParts }]); // Store the new parts
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

    // Effect to update currentProjectForStory when currentProject changes
    useEffect(() => {
        if (currentProject) {
            setCurrentProjectForStory(currentProject);
        }
    }, [currentProject]);

    // Kiss animation
    const throwKiss = useCallback(() => {
        const kissAnimationContainer = document.getElementById('kiss-animation-container');
        if (!kissAnimationContainer) return;

        const kissElement = document.createElement('div');
        kissElement.innerHTML = '😘';
        kissElement.classList.add('kiss-animation'); // Use the CSS class for animation properties
        
        // Random starting position near the center bottom (adjusted for actual CSS animation)
        const startX = Math.random() * (window.innerWidth / 2) + window.innerWidth / 4;
        kissElement.style.left = `${startX}px`;

        // Pass random values for more varied animations
        kissElement.style.setProperty('--random-x', Math.random().toString());
        kissElement.style.setProperty('--random-y', Math.random().toString());
        kissElement.style.setProperty('--random-duration', Math.random().toString());
        kissElement.style.setProperty('--delay', `${Math.random() * 0.5}s`); // Slight delay variation

        kissAnimationContainer.appendChild(kissElement);

        // Clean up the element after animation ends
        kissElement.addEventListener('animationend', () => {
            kissElement.remove();
        });
    }, []);


    return (
        <div className="min-h-screen bg-background text-text-color">
            <Navigation
                currentView={appState.view}
                onNavigate={handleNavigate}
                onTutorialClick={handleTutorialClick} // Renamed prop
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
                onTutorialClick={handleTutorialClick} // Renamed prop
                onThrowKiss={throwKiss}
                onNavigateToLatestProject={handleNavigateToLatestProject}
                onDiaryClick={handleDiaryClick}
                onOpenChatbot={handleOpenChatbot}
            />

            <main className="p-4 sm:p-6 lg:p-8">
                {isLoading && (
                    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-center animate-fade-in">
                        <div className="w-20 h-20 border-8 border-dashed rounded-full animate-spin border-primary-accent mb-6"></div>
                        <p className="text-3xl font-bold main-title title-gradient mb-4">{magicPhrase}</p>
                        <p className="text-lg text-text-color-soft italic max-w-md mb-8">{philosophicalPhrase}</p>
                        {trendingDesignImages.length > 0 && (
                            <div className="w-64 h-40 overflow-hidden rounded-xl shadow-xl">
                                <ImageWithFallback
                                    src={trendingDesignImages[currentTrendingImageIndex].image.data
                                        ? `data:${trendingDesignImages[currentTrendingImageIndex].image.mimeType};base64,${trendingDesignImages[currentTrendingImageIndex].image.data}`
                                        : null}
                                    alt="Inspiración de diseño"
                                    className="w-full h-full object-cover animate-fade-in-out"
                                    fallbackIconClassName="w-1/2 h-1/2"
                                    loading="eager"
                                />
                            </div>
                        )}
                    </div>
                )}

                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center gap-2 error-message-card" role="alert">
                        <ErrorIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="block sm:inline">{errorMessage}</span>
                        <button onClick={() => setErrorMessage(null)} className="ml-auto text-red-700 hover:text-red-900" aria-label="Cerrar alerta de error">
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {showTutorial && <Tutorial onClose={handleCloseTutorial} />}
                {/* RefineTutorial ahora se gestiona desde ProjectView/RefinementPanel */}
                {/* {showRefineTutorial && <RefineTutorial onClose={() => setShowRefineTutorial(false)} />} */}
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

                {/* Main content is always rendered, isLoading only controls the overlay */}
                <>
                    {appState.view === 'upload' && (
                        <ImageUpload
                            onImageUpload={handleImageUpload}
                            recentProjects={allProjects.filter((_, i) => i < 4)} // Show up to 4 recent projects
                            onViewProject={(id) => handleNavigate('project', id)}
                            aspectRatio={aspectRatio}
                            setAspectRatio={setAspectRatio}
                        />
                    )}
                    {appState.view === 'project' && currentProject && (
                        <ProjectView
                            project={currentProject}
                            initialStyleName={initialStyleNameForProjectView.current}
                            initialActiveTabLabel={initialTabLabelForProjectView.current}
                            onGenerateRefinement={handleGenerateRefinement} // Nuevo prop
                            onCommitRefinement={handleCommitRefinement}   // Nuevo prop
                            onFavorite={handleFavorite}
                            // onRevert={handleRevert} // Eliminado
                            onSaveProjectName={(newName) => handleSaveProjectName(currentProject.id, newName)}
                            onSaveComment={handleSaveComment} // Se pasa a ProjectView
                            onGenerateStory={handleGenerateStory}
                            showRefineTutorial={showRefineTutorial} // Pasar estado del tutorial
                            setShowRefineTutorial={setShowRefineTutorial} // Pasar setter del tutorial
                            onGenerateNextStyle={handleGenerateNextStyle} // NUEVO: para generar estilos individualmente
                        />
                    )}
                    {appState.view === 'archive' && (
                        <ArchiveView
                            projects={allProjects}
                            onView={(id) => handleNavigate('project', id)}
                            onDelete={handleDeleteProject}
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
                            onSaveComment={handleSaveComment} // Se pasa a DiaryView
                        />
                    )}
                </>
            </main>

            <ConfirmationDialog
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={confirmDeleteProject}
                title="¿Estás segura?"
                message="Esta inspiración se desvanecerá para siempre. ¿Quieres continuar?"
            />
            <ConfirmationDialog
                isOpen={isConfirmDeleteFavoriteOpen}
                onClose={() => setIsConfirmDeleteFavoriteOpen(false)}
                onConfirm={confirmDeleteFavorite}
                title="¿Dejar go esta joya?"
                message="Esta joya de diseño se irá de tus favoritos. ¿Quieres continuar?"
            />

            {showBillingDisclaimer && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-xl bg-gradient-to-r from-primary-accent to-secondary-accent text-white shadow-xl flex items-center gap-4 max-w-lg animate-fade-in" role="alert">
                    <SparklesIcon className="w-6 h-6 flex-shrink-0" />
                    <p className="text-sm">
                        ¡Atención, maga del diseño! Esta aplicación utiliza la API de Google Gemini, lo cual puede generar costos de uso.
                        Asegúrate de revisar la <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-white/80">documentación de facturación</a> para entender los cargos.
                    </p>
                    <button onClick={() => setShowBillingDisclaimer(false)} className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Cerrar aviso de facturación">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;