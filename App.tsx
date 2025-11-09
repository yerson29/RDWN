import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Project, StyleVariation, AppView, ImageBase64, Iteration, FavoriteDesign, Furniture, Comment, ALL_STYLES } from './types';
import Navigation from './components/Header';
import ImageUpload from './components/ImageUpload';
import ProjectView from './components/ProjectView';
import ArchiveView from './components/ArchiveView';
import FavoritesView from './components/FavoritesView';
import Tutorial from './components/Tutorial';
import { Modal } from './components/Modal';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { analyzeImage, generateInitialDesignsStream, refineDesign } from './services/geminiService';
import { ErrorIcon, HeartIcon, ShareIcon, ClipboardIcon, ChevronLeftIcon, ChevronRightIcon, KissIcon, SparkleHeartIcon, MagicBookIcon, ViewIcon } from './components/icons/Icons';
import { getSeedData } from './seedData';
import RefineTutorial from './components/RefineTutorial';

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
    "Donde la creatividad no tiene límites, Rosi, tu estilo es eterno.",
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

const FUNNY_TENDER_PHRASES = [
  "Rosi, tu buen gusto es tan contagioso que hasta los muebles quieren bailar.",
  "No eres diseñadora, eres una hada madrina de los espacios. ¡Abracadabra!",
  "¡Atención, mundo! Rosi está creando algo increíble. Agárrense fuerte.",
  "Tu sonrisa es el mejor accesorio para cualquier habitación. ¡No la olvides!",
  "Si la creatividad fuera un superpoder, tú serías la heroína del diseño.",
  "Que cada día esté tan lleno de color y alegría como los diseños que creas.",
  "Recuerda: los errores son solo oportunidades para un diseño aún más fabuloso.",
  "La vida es un lienzo en blanco. ¡Píntalo con los colores de tu felicidad, Rosi!",
  "Siempre hay espacio para un poco más de magia y mucho más diseño.",
  "Eres la musa de tu propio hogar, ¡déjate llevar por tu inspiración!",
  "Que tus espacios te abracen con la misma calidez que tú pones en ellos.",
  "Un beso de inspiración para cada idea que florezca en tu mente.",
  "Tu toque es único. No hay dos espacios como los que tú creas.",
  "Sigue ese instinto mágico, él te guiará hacia diseños espectaculares.",
  "Con cada diseño, estás creando un pedacito más de tu felicidad.",
  "El universo te sonríe, Rosi, y tus diseños lo demuestran.",
  "Tu creatividad brilla más que mil constelaciones. ¡Deja que tu visión diseñe!",
  "Si tu espacio pudiera hablar, diría: '¡Tienes un gusto increíble!'",
  "No hay desafío que tu ingenio y este universo de sueños no puedan transformar. ¡A diseñar!",
  "Rosi, recuerda: cada idea tuya es el comienzo de una obra maestra.",
  "La vida es demasiado corta para espacios sin magia. ¡Ponle tu chispa!",
  "Tu imaginación es la clave. Este universo solo es la herramienta que te ayuda a manifestarla.",
  "¡Prepárate! Tu buen gusto está a punto de dejar una huella imborrable en tu espacio.",
  "Eres la arquitecta de tus propios milagros de diseño. ¡Adelante!",
  "Que tu día sea tan brillante como el espacio que estás a punto de crear.",
  "El secreto de un espacio feliz está en tu visión... y en tu sonrisa.",
  "No te preocupes, la magia del diseño es para disfrutarla. ¡Relájate y crea!",
  "Tu espacio es un reflejo de tu espíritu. ¡Hazlo tan hermoso como tus sueños!",
  "Tu chispa creativa es el mejor tesoro de Rosi Decora.",
  "Que cada diseño te recuerde lo increíble que eres.",
  "Eres la estrella que ilumina cada rincón de tu hogar.",
  "Con un clic, transformas el mundo, Rosi.",
  "Tu visión es un regalo para el diseño. ¡Compártela!",
  "Que la inspiración te susurre dulces ideas al oído.",
  "Cada diseño es un abrazo de tu corazón a tu espacio.",
  "Tu creatividad es infinita, como un cielo estrellado.",
  "Rosi, tu buen gusto es una obra de arte en sí mismo.",
  "Deja que tu magia fluya y cree espacios que te hagan soñar.",
  "Tu pasión por el diseño es el motor de este universo.",
  "Que la alegría de crear te acompañe siempre, Rosi.",
  "Eres la dueña de tus sueños y la arquitecta de tu felicidad.",
  "Tu ingenio es el ingrediente secreto de cada diseño exitoso.",
  "Tu espacio es tu lienzo, y tú eres la artista más talentosa.",
  "Cada día es una nueva oportunidad para diseñar tu felicidad.",
  "El encanto de tu hogar comienza con un pensamiento tuyo.",
  "No hay límites para la belleza que puedes crear, Rosi.",
  "Que tu corazón guíe cada pincelada de diseño.",
  "Eres la esencia de la belleza en cada espacio.",
  "Tu visión es un faro de inspiración para todos.",
  "Con cada diseño, siembras alegría en tu hogar."
];

const INITIAL_DIARY_GREETING_PHRASE = "¡Bienvenida a tu Universo de Sueños, Rosi! Un espacio creado con la magia de Yerson, para que cada rincón hable de ti y de tus anhelos.";

// --- Helper Functions ---
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : fallback;
  } catch (error) {
    console.error(`Error al leer del localStorage “${key}”:`, error);
    return fallback;
  }
};

// --- UI Components ---
const HeartSpinner = () => (
    <div className="relative w-24 h-24">
        <HeartIcon className="w-24 h-24 text-pink-300" />
        <HeartIcon className="w-24 h-24 text-pink-500 absolute top-0 left-0 animate-ping" />
        <HeartIcon className="w-24 h-24 text-pink-500 absolute top-0 left-0" />
    </div>
);

const LoadingOverlay = ({ message }: { message: string }) => (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col justify-center items-center z-[100] animate-fade-in text-center p-4">
        <HeartSpinner />
        <p className="mt-8 text-xl font-semibold text-primary-accent max-w-sm">{message}</p>
    </div>
);

const KissesOverlay: React.FC<{ kisses: { id: number; x: number }[] }> = ({ kisses }) => (
    <>
        {kisses.map(kiss => (
            <div key={kiss.id} className="kiss-animation" style={{ left: `${kiss.x}%`, animationDuration: `${3 + Math.random() * 3}s` }}>
                😘
            </div>
        ))}
    </>
);

// --- Main App Component ---
const App: React.FC = () => {
  const seedData = useMemo(() => getSeedData(), []);
  
  // State Management
  const [appState, setAppState] = useState<AppState>(() => loadFromStorage<AppState>('rosi-decora-app-state', initialAppState));
  const { view, currentProjectId } = appState;

  const [projects, setProjects] = useState<Project[]>(() => loadFromStorage<Project[]>('rosi-decora-projects', seedData.projects));
  const [favorites, setFavorites] = useState<FavoriteDesign[]>(() => loadFromStorage('rosi-decora-favorites', seedData.favorites));
  const [rosiComments, setRosiComments] = useState<Comment[]>(() => loadFromStorage('rosi-decora-comments', []));
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Dark mode is removed, assume always light mode
  // const [isDarkMode, setIsDarkMode] = useState(() => loadFromStorage('rosi-decora-dark-mode', false)); 
  const [showTutorial, setShowTutorial] = useState(false);
  const [showRefineTutorial, setShowRefineTutorial] = useState(false);
  
  // Modal & Dialog States
  const [showRosiModal, setShowRosiModal] = useState(false);
  const [modalMagicPhrase, setModalMagicPhrase] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
  const [kisses, setKisses] = useState<{ id: number; x: number }[]>([]);
  
  // Rosi's Modal Specific State
  const [newRosiComment, setNewRosiComment] = useState('');
  const [showCommentsHistory, setShowCommentsHistory] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [rosiFunnyTenderPhrase, setRosiFunnyTenderPhrase] = useState('');

  // Derived State
  const currentProject = useMemo(() => {
    if (!currentProjectId) return null;
    return projects.find(p => p.id === currentProjectId) || null;
  }, [currentProjectId, projects]);

  // Effects
  useEffect(() => { localStorage.setItem('rosi-decora-app-state', JSON.stringify(appState)); }, [appState]);
  useEffect(() => { localStorage.setItem('rosi-decora-projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('rosi-decora-favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('rosi-decora-comments', JSON.stringify(rosiComments)); }, [rosiComments]);
  
  // Removed dark mode useEffect
  // useEffect(() => {
  //   if (isDarkMode) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  //   localStorage.setItem('rosi-decora-dark-mode', JSON.stringify(isDarkMode));
  // }, [isDarkMode]);
  
  useEffect(() => {
    if (!showRosiModal) return;
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [showRosiModal]);
  
  useEffect(() => {
    if (!localStorage.getItem('rosi-decora-tutorial-seen')) {
      setShowTutorial(true);
    }
  }, []);

  // Functions
  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prevState => ({ ...prevState, ...updates }));
  };
  
  const showToast = (message: string) => {
    setToast({ message, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };
  
  const getRandomLoadingMessage = useCallback(() => {
    return MAGIC_PHRASES[Math.floor(Math.random() * MAGIC_PHRASES.length)];
  }, []);

  const getRandomFunnyTenderPhrase = useCallback(() => {
    return FUNNY_TENDER_PHRASES[Math.floor(Math.random() * FUNNY_TENDER_PHRASES.length)];
  }, []);

  const streamDesigns = async (projectToUpdate: Project, base64Data: string, mimeType: string) => {
      try {
        const generator = generateInitialDesignsStream(base64Data, mimeType);
        for await (const variation of generator) {
            setProjects(prevProjects => prevProjects.map(p => {
                if (p.id === projectToUpdate.id && !p.styleVariations.some(v => v.style_name === variation.style_name)) {
                    return { ...p, styleVariations: [...p.styleVariations, variation] };
                }
                return p;
            }));
        }
      } catch (err: any) {
        setError(err.message); // Set error message directly from service
      }
  };

  const handleOpenRosiModal = () => {
    setModalMagicPhrase(INITIAL_DIARY_GREETING_PHRASE); // Specific initial phrase for the diary
    setRosiFunnyTenderPhrase(getRandomFunnyTenderPhrase());
    setShowRosiModal(true);
  };

  const handleImageUpload = async (file: File) => {
      setIsLoading(true);
      setLoadingMessage(getRandomLoadingMessage());
      setError(null); // Clear previous errors
      try {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
              const dataUrl = reader.result as string;
              const base64Data = dataUrl.split(',')[1];
              const mimeType = file.type;
              
              const analysis = await analyzeImage(base64Data, mimeType);
              
              const newProject: Project = {
                  id: `project-${Date.now()}`,
                  name: `Tu Rincón Soñado`,
                  originalImage: dataUrl,
                  originalImageBase64: { data: base64Data, mimeType },
                  analysis,
                  styleVariations: [],
                  createdAt: new Date().toISOString(),
              };

              setProjects(prev => [newProject, ...prev]);
              updateAppState({ view: 'project', currentProjectId: newProject.id });
              
              // Start streaming designs
              await streamDesigns(newProject, base64Data, mimeType);

              // After the loop, all initial variations for newProject should be generated.
              // Check if refine tutorial should be shown.
              if (!localStorage.getItem('rosi-decora-refine-tutorial-seen')) {
                  setShowRefineTutorial(true);
              }
          };
      } catch (err: any) {
          setError(err.message); // Set error message directly from service
      } finally {
          setIsLoading(false);
      }
  };
  
  const handleRefine = async (project: Project, styleName: string, prompt: string) => {
    setIsLoading(true);
    setLoadingMessage(getRandomLoadingMessage());
    setError(null); // Clear previous errors
    try {
        const styleIndex = project.styleVariations.findIndex(v => v.style_name === styleName);
        if (styleIndex === -1) throw new Error("Style not found");

        const currentVariation = project.styleVariations[styleIndex];
        const lastIteration = currentVariation.iterations[currentVariation.iterations.length - 1];
        const imageToRefine = lastIteration?.imageBase64 ?? currentVariation.imageBase64;
        if (!imageToRefine) throw new Error("No hay imagen para refinar.");
        
        const { newImage, newDetails } = await refineDesign(imageToRefine.data, imageToRefine.mimeType, prompt, styleName);
        const newIteration: Iteration = {
            prompt,
            imageUrl: `data:${newImage.mimeType};base64,${newImage.data}`,
            imageBase64: newImage,
            description: newDetails.description,
            color_palette: newDetails.color_palette,
            furniture_recommendations: newDetails.furniture_recommendations,
        };

        setProjects(projects.map(p => {
            if (p.id === project.id) {
                const updatedVariations = [...p.styleVariations];
                updatedVariations[styleIndex].iterations.push(newIteration);
                return { ...p, styleVariations: updatedVariations };
            }
            return p;
        }));
        handleThrowKiss(); // Añadir lluvia de besos al refinar un diseño
    } catch (err: any) {
        setError(err.message); // Set error message directly from service
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRevert = (project: Project, styleName: string) => {
    setProjects(projects.map(p => {
      if (p.id === project.id) {
        const styleIndex = p.styleVariations.findIndex(v => v.style_name === styleName);
        if (styleIndex !== -1 && p.styleVariations[styleIndex].iterations.length > 0) {
          p.styleVariations[styleIndex].iterations.pop();
          return { ...p, styleVariations: [...p.styleVariations] };
        }
      }
      return p;
    }));
  }

  const handleDeleteProjectRequest = (projectId: string) => {
    setConfirmAction({
        title: "Liberar una Inspiración",
        message: "¿Quieres que este diseño vuele lejos? Una vez eliminado, no podremos recuperarlo.",
        onConfirm: () => {
            setProjects(prev => prev.filter(p => p.id !== projectId));
            setFavorites(prev => prev.filter(f => f.projectId !== projectId));
            if (currentProjectId === projectId) {
                updateAppState({ view: 'archive', currentProjectId: null });
            }
            setConfirmAction(null);
        }
    });
  };

  const handleFavorite = (designToFavorite: StyleVariation, projectId: string, projectName: string) => {
    if (favorites.some(fav => fav.styleVariation.imageUrl === designToFavorite.imageUrl && fav.projectId === projectId)) {
      showToast("¡Este tesoro ya brilla en tu cofre!");
      return;
    }
    const newFavorite: FavoriteDesign = {
      id: `fav-${Date.now()}`,
      projectId,
      projectName,
      favoritedAt: new Date().toISOString(),
      styleVariation: JSON.parse(JSON.stringify(designToFavorite)),
    };
    setFavorites(prev => [newFavorite, ...prev]);
    showToast("¡Una joya de tu inspiración guardada con brillo! ✨");
    handleThrowKiss(); // Añadir lluvia de besos al guardar un diseño como favorito
  };
  
  const handleDeleteFavoriteRequest = (favoriteId: string) => {
     setConfirmAction({
        title: "Liberar una Joya",
        message: "¿Quieres que esta joya de tu inspiración vuele libre?",
        onConfirm: () => {
            setFavorites(prev => prev.filter(f => f.id !== favoriteId));
            setConfirmAction(null);
        }
    });
  };

  const handleSaveProjectName = (projectId: string, newName: string) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, name: newName } : p));
    setFavorites(favs => favs.map(f => f.projectId === projectId ? { ...f, projectName: newName } : f));
  };
  
  const handleNavigate = (targetView: AppView) => {
    const updates: Partial<AppState> = { view: targetView };
    if (targetView !== 'project') {
      updates.currentProjectId = null;
    }
    updateAppState(updates);
  };

  const handleNavigateToLatestProject = useCallback(() => {
    if (projects.length === 0) {
      showToast("¡Sube una foto primero para crear tu primer estilo!");
      updateAppState({ view: 'upload' });
      return;
    }
    // Find the project with the most recent createdAt date
    const latestProject = projects.reduce((latest, current) => {
      return (new Date(current.createdAt) > new Date(latest.createdAt)) ? current : latest;
    }, projects[0]);

    if (latestProject) {
      updateAppState({ view: 'project', currentProjectId: latestProject.id });
    } else {
      showToast("No se encontraron proyectos para mostrar.");
      updateAppState({ view: 'upload' });
    }
  }, [projects, updateAppState]);
  
  const handleSaveComment = (projectId: string, styleName: string, text: string) => {
      const newComment: Comment = {
          id: `comment-${Date.now()}`, text, createdAt: new Date().toISOString()
      };
      setProjects(projects.map(p => {
          if (p.id === projectId) {
              p.styleVariations.forEach(sv => {
                  if (sv.style_name === styleName) {
                      sv.comments = [newComment, ...(sv.comments || [])];
                  }
              });
              return { ...p, styleVariations: [...p.styleVariations] };
          }
          return p;
      }));
      showToast("¡Tu pensamiento fue capturado con cariño para ti!");
  };

  const handleSaveRosiComment = () => {
    if (newRosiComment.trim()) {
      const newEntry: Comment = {
        id: `rosi-${Date.now()}`,
        text: newRosiComment.trim(),
        createdAt: new Date().toISOString()
      };
      setRosiComments(prev => [newEntry, ...prev]);
      setNewRosiComment('');
      showToast("¡Tu dulce mensaje ha sido grabado en este universo digital!");
      setShowCommentsHistory(true);
    }
  };

  const handleClearRosiComments = () => {
    setConfirmAction({
        title: "Borrar Tu Diario",
        message: "¿Quieres borrar todas estas pequeñas chispas de tu diario?",
        onConfirm: () => {
            setRosiComments([]); setConfirmAction(null);
            showToast("Tu diario está listo para nuevas historias contigo.");
        }
    });
  };

  // Removed horoscope action handler
  const handleRosiPhraseAction = async (action: 'copy', phrase: string) => {
    if (action === 'copy') {
        await navigator.clipboard.writeText(phrase);
        showToast(`¡Frase copiada para ti!`);
    } else if (navigator.share) {
        await navigator.share({ 
            title: `Un Susurro de Inspiración`, 
            text: `Mira este diseño que has creado con la ayuda de tu universo de sueños.` 
        });
    } else {
        showToast("Tu navegador no puede compartir la chispa de este momento.");
    }
  };

  const handleThrowKiss = () => {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const newKiss = {
                id: Date.now() + i,
                x: Math.random() * 95,
            };
            setKisses(prev => [...prev, newKiss]);
            setTimeout(() => {
                setKisses(currentKisses => currentKisses.filter(k => k.id !== newKiss.id));
            }, 5000);
        }, i * 100);
    }
  };

  const renderView = () => {
    switch(view) {
      case 'project':
        if (!currentProject) {
            updateAppState({ view: 'archive', currentProjectId: null });
            return null;
        }
        return <ProjectView 
                    project={currentProject} 
                    onRefine={handleRefine} 
                    onFavorite={handleFavorite}
                    onRevert={handleRevert}
                    onSaveProjectName={(newName) => handleSaveProjectName(currentProject.id, newName)}
                    onSaveComment={handleSaveComment}
                />;
      case 'archive':
        return <ArchiveView projects={projects} onView={(id) => updateAppState({ view: 'project', currentProjectId: id })} onDelete={handleDeleteProjectRequest} />;
      case 'favorites':
        return <FavoritesView favorites={favorites} onView={(id, styleName) => updateAppState({ view: 'project', currentProjectId: id })} onDelete={handleDeleteFavoriteRequest} onNavigateToUpload={() => handleNavigate('upload')} />;
      case 'upload':
      default:
        return <ImageUpload onImageUpload={handleImageUpload} recentProjects={projects.slice(0, 4)} onViewProject={(id) => updateAppState({ view: 'project', currentProjectId: id })} />;
    }
  }

  const isQuotaError = error?.startsWith("QUOTA_EXCEEDED:");
  const errorMessageTitle = isQuotaError ? "¡Alerta Mágica!" : "¡Oh no!";
  const errorMessageContent = isQuotaError 
    ? error?.replace("QUOTA_EXCEEDED:", "") 
    : error;
  const errorButtonCopy = isQuotaError ? "Entendido" : "Copiar Error";
  const errorIconClass = isQuotaError ? "text-primary-accent" : "text-red-400";


  return (
    <div className="min-h-screen">
      <KissesOverlay kisses={kisses} />
      {isLoading && <LoadingOverlay message={loadingMessage} />}
      {toast && (
        <div key={toast.id} className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-accent to-secondary-accent text-white px-6 py-3 rounded-full shadow-lg z-[101] animate-fade-in flex items-center gap-3">
            <HeartIcon className="w-6 h-6" /><span>{toast.message}</span>
        </div>
      )}

      <Modal isOpen={!!error} onClose={() => setError(null)} title={errorMessageTitle} cardClassName="gradient-card" titleClassName="title-gradient">
        <div className="text-center">
          <ErrorIcon className={`w-16 h-16 mx-auto mb-4 ${errorIconClass}`} />
          <p className="text-text-color-soft mb-6">{errorMessageContent}</p>
          <div className="flex gap-4">
              {isQuotaError ? (
                  <a 
                      href="https://ai.google.dev/gemini-api/docs/rate-limits" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 px-6 py-3 rounded-full bg-white text-text-color font-semibold shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
                  >
                      <ViewIcon className="w-5 h-5" /> Revisar Límites
                  </a>
              ) : (
                  <button onClick={() => { navigator.clipboard.writeText(error || ""); showToast("Detalles copiados."); }} className="flex-1 px-6 py-3 rounded-full bg-gray-200 text-gray-700 font-semibold shadow-md hover:scale-105 transition-transform">{errorButtonCopy}</button>
              )}
              <button onClick={() => setError(null)} className="flex-1 px-6 py-3 rounded-full btn-primary text-white font-semibold">Entendido</button>
          </div>
        </div>
      </Modal>

      <Modal 
          isOpen={showRosiModal} 
          onClose={() => { setShowRosiModal(false); setShowCommentsHistory(false); }} 
          title="Tu Diario"
          cardClassName="bg-white text-text-color shadow-lg border border-gray-200"
          titleClassName="text-primary-accent text-center"
          headerRightContent={
            <div className="text-right text-text-color-soft text-sm mr-2 flex flex-col items-end">
                <span className="font-semibold">{currentDateTime.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                <span className="text-xs">{currentDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          }
      >
          <div className="max-h-[80vh] overflow-y-auto">
            {/* White card container for the diary content */}
            <div className="text-center w-full">
              <p className="text-text-color-soft mt-2 text-lg italic">"{modalMagicPhrase}"</p>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h4 className="text-2xl font-bold main-title text-primary-accent mb-2 text-center flex items-center justify-center gap-2">
                    Susurros del Cosmos <SparkleHeartIcon className="w-6 h-6 text-primary-accent"/>
                </h4>
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
                    <SparkleHeartIcon className="w-10 h-10 text-primary-accent mx-auto mb-2" />
                    <h5 className="text-xl font-bold main-title text-primary-accent mb-2">¡Para ti!</h5>
                    <p className="text-text-color-soft italic">
                        "{rosiFunnyTenderPhrase}"
                    </p>
                    <button onClick={() => handleRosiPhraseAction('copy', rosiFunnyTenderPhrase)} className="flex items-center justify-center gap-1.5 text-xs mt-3 px-3 py-1.5 rounded-full bg-gray-100 text-text-color hover:bg-gray-200 transition mx-auto" title="Copiar Frase">
                        <ClipboardIcon className="w-4 h-4"/> Copiar
                    </button>
                </div>
              </div>
              
              <div className="mt-8">
                  <button onClick={handleThrowKiss} className="w-full px-6 py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2">
                      <KissIcon className="w-6 h-6"/> Lluvia de Besos para Ti
                  </button>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h4 className="text-xl font-bold main-title text-primary-accent mb-3 text-center flex items-center justify-center gap-2">
                    Tu Diario <HeartIcon className="w-5 h-5 text-primary-accent"/>
                </h4>
                <textarea value={newRosiComment} onChange={(e) => setNewRosiComment(e.target.value)} placeholder="Escribe aquí tus pensamientos..." className="w-full p-3 rounded-lg bg-white border border-gray-200 mb-3 text-text-color" rows={3}></textarea>
                <button onClick={handleSaveRosiComment} disabled={!newRosiComment.trim()} className="w-full px-6 py-3 btn-primary disabled:opacity-50">Guardar Mensaje</button>
              </div>

              <div className="mt-6">
                <button onClick={() => setShowCommentsHistory(p => !p)} className="w-full px-6 py-3 rounded-full bg-gray-100 text-text-color font-semibold shadow-md hover:bg-gray-200 transition">
                    {showCommentsHistory ? 'Ocultar Tu Diario' : 'Ver Tu Diario'}
                </button>
                {showCommentsHistory && (
                    <div className="mt-4 p-4 bg-white rounded-lg text-left max-h-48 overflow-y-auto border border-gray-200 shadow-inner">
                        {rosiComments.length > 0 ? (
                            <>
                            <ul className="space-y-4">
                                {rosiComments.map(comment => (
                                    <li key={comment.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                                        <p className="text-text-color break-words">{comment.text}</p>
                                        <p className="text-xs text-text-color-soft text-right mt-1">{new Date(comment.createdAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' })}</p>
                                    </li>
                                ))}
                            </ul>
                            <button onClick={handleClearRosiComments} className="mt-4 text-sm text-red-500 hover:text-red-700">Limpiar Tu Diario</button>
                            </>
                        ) : <p className="text-text-color-soft text-center">Tu diario está esperando tus palabras.</p>}
                    </div>
                )}
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <button onClick={() => { setShowRosiModal(false); setShowCommentsHistory(false); }} className="w-full px-6 py-3 rounded-full bg-gray-100 text-text-color font-semibold shadow-md hover:bg-gray-200 transition">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
      </Modal>
      
      {showTutorial && <Tutorial onClose={() => { setShowTutorial(false); localStorage.setItem('rosi-decora-tutorial-seen', 'true'); }} />}
      {showRefineTutorial && <RefineTutorial onClose={() => { setShowRefineTutorial(false); localStorage.setItem('rosi-decora-refine-tutorial-seen', 'true'); }} />}
      {confirmAction && <ConfirmationDialog isOpen={!!confirmAction} onClose={() => setConfirmAction(null)} onConfirm={confirmAction.onConfirm} title={confirmAction.title} message={confirmAction.message}/>}
      
      <Navigation currentView={view} onNavigate={handleNavigate} onRosiClick={handleOpenRosiModal} onThrowKiss={handleThrowKiss} onNavigateToLatestProject={handleNavigateToLatestProject} />
      <main className="p-4 sm:p-8 max-w-7xl mx-auto pb-8"> {/* Adjusted padding-bottom */}
        <div key={view} className="animate-fade-in">{renderView()}</div>
      </main>
    </div>
  );
};

export default App;