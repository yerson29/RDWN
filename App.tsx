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
import { analyzeImage, generateInitialDesignsStream, refineDesign, generateStoryParagraph, regenerateStoryParagraph } from './services/geminiService';
// Se agregaron las importaciones de iconos faltantes desde el archivo de iconos.
import { ErrorIcon, HeartIcon, ShareIcon, ClipboardIcon, ChevronLeftIcon, ChevronRightIcon, KissIcon, SparklesIcon, MagicBookIcon, ViewIcon, DreamHeartIcon, MagicWandIcon, StarDustIcon, StarDiamondIcon } from './components/icons/Icons';
import { initialSeedData } from './seedData'; 
import RefineTutorial from './components/RefineTutorial';
import { StoryModal } from './components/StoryModal'; 
import ReactDOM from 'react-dom'; // Import ReactDOM as a module, not from 'react-dom/client' for portal usage
import MobileMenu from './components/MobileMenu'; // Import MobileMenu

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
  "No hay desafío que tu ingenio y este universo de sueños no pueden transformar. ¡A diseñar!",
  "Rosi, recuerda: cada idea tuya es el comienzo de una obra maestra.",
  "La vida es demasiado corta para espacios sin magia. ¡Ponle tu chispa!",
  "Tu imaginación es la clave. Este universo solo es la herramienta que te ayuda a manifestarla.",
  "¡Prepárate! Tu buen gusto está a punto de dejar una huella imborrable en tu espacio.",
  "Eres la arquitecta de tus propios milagros de diseño. ¡Adelante!",
  "Que tu día sea tan brillante como el espacio que estás a punto de crear.",
  "El secreto de un espacio feliz está en tu visión... y en tu sonrisa.",
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

const YERSON_PHRASES = [
  "Rosi, tu creatividad es el puente entre lo que sueñas y lo que diseñas. ¡Siempre adelante!",
  "Cada espacio cuenta una historia, y tú, Rosi, eres la narradora más brillante.",
  "El diseño no es solo lo que ves, sino lo que sientes. ¡Inspira emociones!",
  "Que tu hogar sea un reflejo de la belleza que llevas dentro, Rosi.",
  "La armonía en el diseño se encuentra en la esencia de tu ser.",
  "Recuerda, Rosi, los pequeños detalles crean grandes universos en tus espacios.",
  "Transformar es crear, y crear es amar. Ama cada rincón que diseñas.",
  "Tu visión es la brújula que guía cada trazo de tu creatividad. ¡Confía en ella!",
  "Con cada idea, Rosi, estás construyendo un futuro más hermoso para tu espacio.",
  "El verdadero arte del diseño reside en hacer que lo imposible parezca sencillo. ¡Tú lo logras!",
  "La inspiración es un soplo del universo, y tú, Rosi, la has capturado.",
  "Que cada diseño sea un paso más hacia el hogar de tus sueños.",
  "El secreto de la felicidad está en el espacio que te rodea. ¡Diseña para ser feliz!",
  "Tu imaginación es ilimitada, como el cielo estrellado que ilumina tu noche.",
  "Deja que tu corazón pinte el canvas de tu hogar con alegría y color.",
  "En cada rincón, una oportunidad para expresar tu esencia. ¡Atrévete a brillar!",
  "Los espacios que diseñas son el eco de tu alma, Rosi. Haz que resuene amor.",
  "Que la luz de tus ideas transforme cada sombra en una obra de arte.",
  "Tu buen gusto es un don. Compártelo con el mundo a través de tus creaciones.",
  "Rosi, en tus manos, cada habitación se convierte en un poema visual.",
];

const DESIGN_HOROSCOPE_MESSAGES = [
  "Hoy, los astros alinean tu intuición para el color. ¡Experimenta con tonos audaces!",
  "La energía cósmica favorece la reorganización. ¡Despeja y encuentra un nuevo flujo en tu espacio!",
  "Es un día propicio para la comodidad. ¡Invierte en textiles suaves y cojines acogedores!",
  "Tu creatividad está en su punto máximo. ¡Deja que un detalle artístico eleve tu diseño!",
  "Las influencias planetarias sugieren un toque natural. ¡Añade plantas o elementos orgánicos!",
  "Busca la simetría hoy. ¡El equilibrio traerá paz a tu rincón!",
  "Un día perfecto para la reflexión y la luz. ¡Considera una nueva iluminación o un espejo estratégico!",
  "La conjunción de Mercurio y Venus impulsa la funcionalidad. ¡Piensa en soluciones inteligentes de almacenamiento!",
  "Tu horóscopo te invita a la calidez. ¡Unas velas o una manta extra serán perfectas!",
  "Hoy es el día para lo inesperado. ¡Introduce un elemento sorpresa que rompa la monotonía!",
  "Marte impulsa la acción: Es el momento de finalizar ese proyecto que tienes en mente.",
  "La luna en tu signo favorece la introspección: Dedica tiempo a visualizar tu espacio ideal.",
  "Júpiter te sonríe: Una nueva adquisición traerá alegría y un toque de lujo a tu hogar.",
  "Saturno te aconseja paciencia: No todas las transformaciones ocurren de la noche a la mañana, disfruta el proceso.",
  "Venus, la diosa del amor, te inspira: Crea un espacio que irradie amor y bienvenida para ti y tus seres queridos.",
  "El sol te recarga: Aprovecha la luz natural al máximo; abre ventanas y despeja cortinas.",
  "Urano trae la originalidad: No temas ser diferente, tu estilo único es tu mayor fortaleza.",
  "Neptuno te invita a soñar: Integra elementos que te transporten, como arte mural o sonidos relajantes.",
  "Plutón renueva: Es un buen momento para despojarte de lo viejo y dar la bienvenida a lo nuevo y transformador.",
  "Mercurio en armonía: La comunicación fluye, pide opiniones a tus seres queridos sobre tus ideas de diseño.",
];

const INITIAL_DIARY_GREETING_PHRASE = "¡Bienvenida a tu Universo de Sueños, Rosi! Un espacio creado con la magia de Yerson, para que cada rincón hable de ti y de tus anhelos.";

// --- Helper Functions ---
const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error loading state from ${key}`, error);
    return fallback;
  }
};

const saveToStorage = <T,>(key: string, state: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error(`Error saving state to ${key}`, error);
  }
};

// --- Main App Component ---
const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() =>
    loadFromStorage('rosi-decora-app-state', initialAppState)
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    loadFromStorage('rosi-decora-projects', initialSeedData.projects)
  );
  const [favorites, setFavorites] = useState<FavoriteDesign[]>(() =>
    loadFromStorage('rosi-decora-favorites', initialSeedData.favorites)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDesigns, setIsGeneratingDesigns] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false); // Changed default to false
  const [showRefineTutorial, setShowRefineTutorial] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<(() => void) | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [currentMagicPhrase, setCurrentMagicPhrase] = useState('');
  const [currentFunnyPhrase, setCurrentFunnyPhrase] = useState('');
  const [currentRefineStyleName, setCurrentRefineStyleName] = useState<string | undefined>(undefined);
  const [initialProjectActiveTab, setInitialProjectActiveTab] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // New states for Yerson's quote and design horoscope
  const [yersonQuote, setYersonQuote] = useState('');
  const [yersonQuoteTimestamp, setYersonQuoteTimestamp] = useState('');
  const [designHoroscope, setDesignHoroscope] = useState('');


  // Story modal states
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [currentStory, setCurrentStory] = useState('');
  const [storyChatHistory, setStoryChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [currentStoryImageBase64, setCurrentStoryImageBase64] = useState<ImageBase64 | null>(null);
  const [currentStoryStyleName, setCurrentStoryStyleName] = useState('');
  const [currentStoryProjectAnalysis, setCurrentStoryProjectAnalysis] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  // Kisses animation states
  const [showKissAnimation, setShowKissAnimation] = useState(false);
  const [kissAnimationKey, setKissAnimationKey] = useState(0); // For re-triggering animation
  const [kissAnimationMessage, setKissAnimationMessage] = useState('');


  // Initialize magic phrases, Yerson's quote, and horoscope
  useEffect(() => {
    setCurrentMagicPhrase(MAGIC_PHRASES[Math.floor(Math.random() * MAGIC_PHRASES.length)]);
    setCurrentFunnyPhrase(FUNNY_TENDER_PHRASES[Math.floor(Math.random() * FUNNY_TENDER_PHRASES.length)]);

    const lastUpdateDate = localStorage.getItem('rosi-decora-yerson-horoscope-date');
    const today = new Date().toDateString();

    if (!lastUpdateDate || lastUpdateDate !== today) {
      // Generate new quotes/horoscope daily
      setYersonQuote(YERSON_PHRASES[Math.floor(Math.random() * YERSON_PHRASES.length)]);
      setYersonQuoteTimestamp(new Date().toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })); // Full date and time
      setDesignHoroscope(DESIGN_HOROSCOPE_MESSAGES[Math.floor(Math.random() * DESIGN_HOROSCOPE_MESSAGES.length)]);
      
      localStorage.setItem('rosi-decora-yerson-horoscope-date', today);
      localStorage.setItem('rosi-decora-yerson-quote', yersonQuote);
      localStorage.setItem('rosi-decora-yerson-quote-timestamp', yersonQuoteTimestamp);
      localStorage.setItem('rosi-decora-design-horoscope', designHoroscope);

    } else {
      // Load saved if already updated today
      setYersonQuote(localStorage.getItem('rosi-decora-yerson-quote') || YERSON_PHRASES[0]);
      setYersonQuoteTimestamp(localStorage.getItem('rosi-decora-yerson-quote-timestamp') || new Date().toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' }));
      setDesignHoroscope(localStorage.getItem('rosi-decora-design-horoscope') || DESIGN_HOROSCOPE_MESSAGES[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount to set initial daily quotes

  // Save Yerson's quote and horoscope to localStorage whenever they change
  useEffect(() => {
    if (yersonQuote) localStorage.setItem('rosi-decora-yerson-quote', yersonQuote);
    if (yersonQuoteTimestamp) localStorage.setItem('rosi-decora-yerson-quote-timestamp', yersonQuoteTimestamp);
    if (designHoroscope) localStorage.setItem('rosi-decora-design-horoscope', designHoroscope);
  }, [yersonQuote, yersonQuoteTimestamp, designHoroscope]);


  // Save app state to localStorage whenever it changes
  useEffect(() => {
    saveToStorage('rosi-decora-app-state', appState);
  }, [appState]);

  // Debounced save for projects and favorites
  useEffect(() => {
    const handler = setTimeout(() => {
      saveToStorage('rosi-decora-projects', projects);
      saveToStorage('rosi-decora-favorites', favorites);
    }, 500); // Debounce by 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [projects, favorites]);


  // Handle API key selection for Veo models (though not used directly here, it's a guideline)
  useEffect(() => {
    const checkApiKey = async () => {
      // Check if window.aistudio exists before calling its methods
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        // You might want to show a modal or alert here,
        // but as per guidelines, the API key is assumed to be available.
        // For GenAI models used here, this check might not be strictly necessary
        // but included to adhere to the rule if Veo models were added.
      }
    };
    checkApiKey();
  }, []);

  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === appState.currentProjectId);
  }, [appState.currentProjectId, projects]);

  const goToView = useCallback((view: AppView, projectId: string | null = null, initialStyleName?: string, initialTabLabel?: string) => {
    setAppState({ view, currentProjectId: projectId });
    // Reset currentRefineStyleName when navigating to a new project or view
    setCurrentRefineStyleName(initialStyleName);
    setInitialProjectActiveTab(initialTabLabel); // Set the initial tab for ProjectView
    setError(null);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  }, []);

  const handleImageUpload = async (file: File) => {
    setError(null);
    setIsLoading(true);
    setIsGeneratingDesigns(true); // Start generating designs immediately

    let newProjectId: string | null = null; 

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // Get base64 content
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const mimeType = file.type;

      // 1. Analyze image
      const analysisResult = await analyzeImage(base64Data, mimeType);

      newProjectId = `project-${Date.now()}`;
      const newProject: Project = {
        id: newProjectId,
        name: `Mi Rincón Mágico ${projects.length + 1}`,
        originalImage: `data:${mimeType};base64,${base64Data}`,
        originalImageBase64: { data: base64Data, mimeType },
        analysis: analysisResult,
        styleVariations: [],
        createdAt: new Date().toISOString(),
      };

      // Add to projects immediately so the UI can start rendering the project view
      setProjects((prev) => [newProject, ...prev]);
      goToView('project', newProjectId);

      // 2. Generate initial designs in a stream
      const generatedVariations: StyleVariation[] = [];
      for await (const variation of generateInitialDesignsStream(base64Data, mimeType)) {
        generatedVariations.push(variation);
        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p.id === newProjectId
              ? { ...p, styleVariations: [...p.styleVariations, variation] }
              : p
          )
        );
      }
      setCurrentMagicPhrase(MAGIC_PHRASES[Math.floor(Math.random() * MAGIC_PHRASES.length)]);

      // Add the initial greeting comment to the first variation
      if (generatedVariations.length > 0) {
        setProjects((prevProjects) =>
          prevProjects.map((p) => {
            if (p.id === newProjectId) {
              const updatedVariations = p.styleVariations.map((v) => {
                if (v.style_name === generatedVariations[0].style_name) {
                  return {
                    ...v,
                    comments: [{ id: `comment-${Date.now()}`, text: INITIAL_DIARY_GREETING_PHRASE, createdAt: new Date().toISOString() }],
                  };
                }
                return v;
              });
              return { ...p, styleVariations: updatedVariations };
            }
            return p;
          })
        );
      }

    } catch (err: any) {
      console.error('Error durante la carga y análisis:', err);
      // If the error message is a string starting with "QUOTA_EXCEEDED:", it's a special error
      if (err.message && err.message.startsWith("QUOTA_EXCEEDED:")) {
        setError(err.message);
      } else {
        setError("¡Oh, no! La magia no pudo fluir esta vez. ¿Intentamos de nuevo?");
      }
      if (newProjectId) { 
        setProjects((prev) => prev.filter(p => p.id !== newProjectId)); // Remove partially created project
      }
      goToView('upload');
    } finally {
      setIsLoading(false);
      setIsGeneratingDesigns(false);
    }
  };

  const handleRefineDesign = async (projectToRefine: Project, styleName: string, prompt: string) => {
    setError(null);
    setIsLoading(true);
    setCurrentRefineStyleName(styleName); // Keep track of the style being refined

    try {
      const styleToRefine = projectToRefine.styleVariations.find((s) => s.style_name === styleName);
      if (!styleToRefine || !styleToRefine.imageBase64) {
        throw new Error('Estilo o imagen base no encontrada para refinar.');
      }

      const { newImage, newDetails } = await refineDesign(
        styleToRefine.imageBase64.data,
        styleToRefine.imageBase64.mimeType,
        prompt,
        styleName
      );

      const newIteration: Iteration = {
        prompt,
        imageUrl: `data:${newImage.mimeType};base64,${newImage.data}`,
        imageBase64: newImage,
        description: newDetails.description,
        color_palette: newDetails.color_palette,
        furniture_recommendations: newDetails.furniture_recommendations,
      };

      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === projectToRefine.id
            ? {
                ...p,
                styleVariations: p.styleVariations.map((s) =>
                  s.style_name === styleName
                    ? { ...s, iterations: [...s.iterations, newIteration] }
                    : s
                ),
              }
            : p
        )
      );
      setCurrentFunnyPhrase(FUNNY_TENDER_PHRASES[Math.floor(Math.random() * FUNNY_TENDER_PHRASES.length)]);
    } catch (err: any) {
      console.error('Error durante el refinamiento:', err);
      // If the error message is a string starting with "QUOTA_EXCEEDED:", it's a special error
      if (err.message && err.message.startsWith("QUOTA_EXCEEDED:")) {
        setError(err.message);
      } else {
        setError('¡Rayos! El hechizo de refinamiento no funcionó. ¿Lo intentamos de nuevo con otra idea?');
      }
    } finally {
      setIsLoading(false);
      setCurrentRefineStyleName(undefined); // Clear refinement state
      setShowRefineTutorial(false);
    }
  };

  const handleRevertDesign = (projectToRevert: Project, styleName: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) =>
        p.id === projectToRevert.id
          ? {
              ...p,
              styleVariations: p.styleVariations.map((s) =>
                s.style_name === styleName
                  ? { ...s, iterations: s.iterations.slice(0, -1) } // Remove last iteration
                  : s
              ),
            }
          : p
        )
    );
  };

  const handleDeleteProject = (projectId: string) => {
    setConfirmationTitle('¿Dejar ir esta inspiración?');
    setConfirmationMessage('Si la dejas ir, desaparecerá para siempre de tu galería. ¿Estás segura?');
    setConfirmationAction(() => () => {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setFavorites((prev) => prev.filter((f) => f.projectId !== projectId)); // Also remove related favorites
      if (appState.currentProjectId === projectId) {
        goToView('upload'); // Go back to upload if current project is deleted
      }
      setShowConfirmation(false);
    });
    setShowConfirmation(true);
  };

  const handleFavoriteDesign = (designToFavorite: StyleVariation, projectId: string, projectName: string) => {
    const favoriteId = `fav-${Date.now()}`;
    const newFavorite: FavoriteDesign = {
      id: favoriteId,
      projectId,
      projectName,
      favoritedAt: new Date().toISOString(),
      styleVariation: designToFavorite,
    };
    setFavorites((prev) => [newFavorite, ...prev]);
    // Trigger kiss animation with a message
    triggerKissAnimation();
  };

  const handleDeleteFavorite = (favoriteId: string) => {
    setConfirmationTitle('¿Dejar ir esta joya?');
    setConfirmationMessage('Si la dejas ir, desaparecerá de tus joyas favoritas. ¿Estás segura?');
    setConfirmationAction(() => () => {
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
      setShowConfirmation(false);
    });
    setShowConfirmation(true);
  };

  const handleSaveProjectName = (newName: string) => {
    if (!appState.currentProjectId) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === appState.currentProjectId ? { ...p, name: newName } : p))
    );
  };
  
  const handleSaveComment = (projectId: string, styleName: string, text: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              styleVariations: project.styleVariations.map(variation =>
                variation.style_name === styleName
                  ? {
                      ...variation,
                      comments: [
                        ...variation.comments,
                        { id: `comment-${Date.now()}`, text, createdAt: new Date().toISOString() },
                      ],
                    }
                  : variation
              ),
            }
          : project
      )
    );
  };

  const handleNavigateToLatestProject = useCallback(() => {
    if (projects.length > 0) {
      goToView('project', projects[0].id);
    } else {
      goToView('upload');
    }
  }, [projects, goToView]);

  const handleDiaryClick = useCallback(() => {
    if (appState.currentProjectId && currentProject) { // Si hay un proyecto activo
        goToView('project', appState.currentProjectId, undefined, 'Tu Diario');
    } else if (projects.length > 0) { // Si hay proyectos pero ninguno activo, ir al más reciente
        goToView('project', projects[0].id, undefined, 'Tu Diario');
    } else { // Si no hay proyectos, mostrar el tutorial
        setShowTutorial(true);
    }
  }, [appState.currentProjectId, currentProject, projects, goToView]);

  const triggerKissAnimation = useCallback(() => {
    const message = FUNNY_TENDER_PHRASES[Math.floor(Math.random() * FUNNY_TENDER_PHRASES.length)];
    setKissAnimationMessage(message);
    setShowKissAnimation(true);
    setKissAnimationKey(prev => prev + 1); // Increment key to re-trigger animation

    setTimeout(() => {
      setShowKissAnimation(false);
      setKissAnimationMessage('');
    }, 4000); // Animation duration
  }, []);

  const handleThrowKiss = useCallback(() => {
    triggerKissAnimation();
  }, [triggerKissAnimation]);

  const handleGenerateStory = useCallback(async (imageBase64: ImageBase64, styleName: string, projectAnalysis: string) => {
    setError(null);
    setIsLoading(true);
    setIsGeneratingStory(true);
    setCurrentStoryImageBase64(imageBase64);
    setCurrentStoryStyleName(styleName);
    setCurrentStoryProjectAnalysis(projectAnalysis);
    setStoryChatHistory([]); // Clear chat history for new story

    try {
      const story = await generateStoryParagraph(imageBase64, styleName, projectAnalysis);
      setCurrentStory(story);
      setStoryChatHistory([{ role: 'model', parts: [{ text: story }] }]);
      setShowStoryModal(true);
    } catch (err: any) {
      console.error('Error al generar historia:', err);
      if (err.message && err.message.startsWith("QUOTA_EXCEEDED:")) {
        setError(err.message);
      } else {
        setError('¡Ups! No pude encontrar un hilo para esta historia. ¿Intentamos con otra inspiración?');
      }
    } finally {
      setIsLoading(false);
      setIsGeneratingStory(false);
    }
  }, []);

  const handleRegenerateStory = useCallback(async (userComment: string) => {
    setError(null);
    setIsLoading(true);
    setIsGeneratingStory(true);

    if (!currentStoryImageBase64 || !currentStoryStyleName || !currentStoryProjectAnalysis) {
      setError("Faltan datos para regenerar la historia. Por favor, reinicia la generación.");
      setIsLoading(false);
      setIsGeneratingStory(false);
      return;
    }

    const updatedChatHistory = [
      ...storyChatHistory,
      { role: 'user', parts: [{ text: userComment }] },
    ];
    setStoryChatHistory(updatedChatHistory);

    try {
      const newStory = await regenerateStoryParagraph(updatedChatHistory, currentStoryImageBase64, currentStoryStyleName, currentStoryProjectAnalysis);
      setCurrentStory(newStory);
      setStoryChatHistory((prev) => [...prev, { role: 'model', parts: [{ text: newStory }] }]);
    } catch (err: any) {
      console.error('Error al regenerar historia:', err);
      if (err.message && err.message.startsWith("QUOTA_EXCEEDED:")) {
        setError(err.message);
      } else {
        setError('¡Ups! La historia se enredó. ¿Probamos con otro comentario?');
      }
    } finally {
      setIsLoading(false);
      setIsGeneratingStory(false);
    }
  }, [storyChatHistory, currentStoryImageBase64, currentStoryStyleName, currentStoryProjectAnalysis]);

  const closeStoryModal = useCallback(() => {
    setShowStoryModal(false);
    setCurrentStory('');
    setStoryChatHistory([]);
    setCurrentStoryImageBase64(null);
    setCurrentStoryStyleName('');
    setCurrentStoryProjectAnalysis('');
    setError(null); // Clear any story-related errors when closing modal
  }, []);

  const showLoader = isLoading || isGeneratingDesigns || isGeneratingStory;

  const Loader = () => (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in p-4">
      <div className="gradient-card rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-95 animate-scale-in">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-6">
          {isGeneratingDesigns || isGeneratingStory ? (
             <MagicBookIcon className="w-14 h-14 text-primary-accent animate-pulse-slow" />
          ) : (
            <StarDustIcon className="w-14 h-14 text-primary-accent animate-spin-slow" />
          )}
        </div>
        <h3 className="text-3xl font-bold main-title title-gradient mb-4">
          {isGeneratingDesigns ? '¡Tejiendo Magia para ti!' : (isGeneratingStory ? '¡Tejiendo un Hilo de tu Historia!' : 'Despertando tu Universo...')}
        </h3>
        <p className="text-text-color-soft text-lg mb-6 leading-relaxed">
          {isGeneratingDesigns ? currentMagicPhrase : (isGeneratingStory ? 'Cada palabra, un toque de magia para tu rincón.' : 'Un instante y tu visión cobrará vida.')}
        </p>
        <div className="relative pt-1">
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-pink-200">
            <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary-accent to-secondary-accent animate-pulse"></div>
          </div>
        </div>
        <p className="text-text-color-soft text-sm">
          {isGeneratingDesigns ? 'Preparando 6 estilos únicos para tu espacio.' : (isGeneratingStory ? 'Solo un poquito más, tu historia está casi lista.' : 'Solo un poquito más...')}
        </p>
      </div>
    </div>
  );

  const RefineLoader = () => (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in p-4">
      <div className="gradient-card rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-95 animate-scale-in">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6">
          <KissIcon className="w-14 h-14 text-purple-600 animate-bounce-slow" />
        </div>
        <h3 className="text-3xl font-bold main-title title-gradient mb-4">
          ¡Un Beso de Inspiración!
        </h3>
        <p className="text-text-color-soft text-lg mb-6 leading-relaxed">
          {currentFunnyPhrase}
        </p>
        <div className="relative pt-1">
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded bg-purple-200">
            <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
          </div>
        </div>
        <p className="text-text-color-soft text-sm">
          {isGeneratingStory ? 'Tu historia está tomando forma...' : '¡Tu visión se está transformando!'}
        </p>
      </div>
    </div>
  );

  const renderKissAnimation = () => {
    if (!showKissAnimation) return null;

    const kisses = Array.from({ length: 5 }).map((_, i) => {
      const style = {
        left: `${Math.random() * 80 + 10}vw`, // Random horizontal position
        animationDelay: `${Math.random() * 0.5}s`, // Staggered animation
        transform: `translateX(${Math.random() * 100 - 50}px)`, // Slight horizontal drift
        fontSize: `${Math.random() * 1.5 + 2}rem`, // Random size
        color: `hsl(${Math.random() * 360}, 70%, 70%)`, // Random playful color
      };
      return (
        <span key={i} className="kiss-animation absolute" style={style}>
          💋
        </span>
      );
    });

    const portalContainer = document.getElementById('kiss-animation-container');
    if (!portalContainer) return null;

    return ReactDOM.createPortal(
      <div className="kiss-animation-wrapper">
        <div className="absolute inset-0">
          {kisses}
        </div>
        {kissAnimationMessage && (
          <h2 className="kiss-message main-title title-gradient">
            {kissAnimationMessage}
          </h2>
        )}
      </div>,
      portalContainer
    );
  };

  return (
    <div className="min-h-screen bg-background-light text-text-color font-sans relative">
      <Navigation
        currentView={appState.view}
        onNavigate={goToView}
        onRosiClick={() => setShowTutorial(true)}
        onThrowKiss={handleThrowKiss}
        onNavigateToLatestProject={handleNavigateToLatestProject}
        onDiaryClick={handleDiaryClick} // Pasamos la nueva función
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={goToView}
        currentView={appState.view}
        onRosiClick={() => setShowTutorial(true)}
        onThrowKiss={handleThrowKiss}
        onNavigateToLatestProject={handleNavigateToLatestProject}
        onDiaryClick={handleDiaryClick}
      />

      <main className="container mx-auto py-8 sm:py-12 px-4">
        {error && (
          <div className="gradient-card border border-red-400 bg-red-50 p-4 rounded-xl mb-8 flex items-center shadow-md">
            <ErrorIcon className="w-7 h-7 text-red-600 mr-3 flex-shrink-0" />
            <p className="text-red-700 font-medium break-words">
              {error}
            </p>
          </div>
        )}

        {appState.view === 'upload' && (
          <ImageUpload onImageUpload={handleImageUpload} recentProjects={projects.slice(0, 4)} onViewProject={(id) => goToView('project', id)} />
        )}
        {appState.view === 'project' && currentProject && (
          <ProjectView
            project={currentProject}
            initialStyleName={currentRefineStyleName}
            onRefine={handleRefineDesign}
            onFavorite={handleFavoriteDesign}
            onRevert={handleRevertDesign}
            onSaveProjectName={handleSaveProjectName}
            onSaveComment={handleSaveComment}
            onGenerateStory={handleGenerateStory} 
            initialActiveTabLabel={initialProjectActiveTab} // Pasamos la prop del tab inicial
            yersonQuote={yersonQuote}
            yersonQuoteTimestamp={yersonQuoteTimestamp}
            designHoroscope={designHoroscope}
          />
        )}
        {appState.view === 'archive' && (
          <ArchiveView
            projects={projects}
            onView={(id) => goToView('project', id)}
            onDelete={handleDeleteProject}
          />
        )}
        {appState.view === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            onView={(projectId, styleName) => goToView('project', projectId, styleName)}
            onDelete={handleDeleteFavorite}
            onNavigateToUpload={() => goToView('upload')}
          />
        )}
      </main>

      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      {showRefineTutorial && <RefineTutorial onClose={() => setShowRefineTutorial(false)} />}
      {showConfirmation && (
        <ConfirmationDialog
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={confirmationAction || (() => {})}
          title={confirmationTitle}
          message={confirmationMessage}
        />
      )}
      {showStoryModal && (
        <StoryModal
          isOpen={showStoryModal}
          onClose={closeStoryModal}
          story={currentStory}
          storyStyleName={currentStoryStyleName}
          chatHistory={storyChatHistory}
          onRegenerate={handleRegenerateStory}
          isLoading={isGeneratingStory}
        />
      )}
      {(showLoader || showKissAnimation) && (
        <>
          {showLoader && (isLoading && !isGeneratingDesigns && !isGeneratingStory ? <Loader /> : (isLoading && isGeneratingDesigns ? <Loader /> : (isGeneratingStory || currentRefineStyleName ? <RefineLoader /> : null)))}
          {showKissAnimation && renderKissAnimation()}
        </>
      )}
    </div>
  );
};

export default App;