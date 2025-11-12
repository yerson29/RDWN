import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MagicBookIcon, SparklesIcon, CloseIcon, ViewIcon, DreamHeartIcon, RevertIcon } from './icons/Icons'; // Asegúrate de DreamHeartIcon y RevertIcon

interface RefineTutorialProps {
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    icon: ViewIcon,
    title: "Paso 1: ¡Explora tus Estilos!",
    text: "Mira los estilos que tu universo de sueños ha creado. Haz clic en el que más te susurre para seleccionarlo y ver sus detalles. ¡Tu inspiración te guiará!",
  },
  {
    icon: MagicBookIcon,
    title: "Paso 2: ¡Tu Visión es el Secreto!",
    text: "En el panel de la derecha, escribe tus ideas. Cuéntale a tu universo qué cambiar o mejorar en el diseño actual. ¡Sé tan detallada como desees!",
  },
  {
    icon: SparklesIcon,
    title: "Paso 3: ¡Ve tu Magia antes de Aplicarla!",
    text: "Después de escribir tu prompt, haz clic en 'Generar Vista Previa'. Verás el nuevo diseño comparado con el anterior. ¡Aquí la magia se muestra antes de ser definitiva!",
  },
  {
    icon: DreamHeartIcon, 
    title: "Paso 4: ¡Aplica o Cancela!",
    text: "Si te encanta la vista previa, haz clic en 'Aplicar Refinamiento' para guardarlo. Si no es lo que esperabas, 'Cancelar' te regresará al diseño anterior para que pruebes nuevas ideas. ¡El control es tuyo!",
  },
  {
    icon: RevertIcon,
    title: "Paso 5: Viaja en el Tiempo de tu Inspiración",
    text: "Usa las flechas 'Deshacer' y 'Rehacer' junto al historial de imágenes para navegar por todas las versiones de tu diseño. ¡Cada paso es una joya que puedes visitar cuando quieras!",
  }
];

const RefineTutorial: React.FC<RefineTutorialProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep(prev => Math.min(prev + 1, TUTORIAL_STEPS.length - 1));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));

  const isLastStep = step === TUTORIAL_STEPS.length - 1;
  const currentStep = TUTORIAL_STEPS[step];

  return (
    <div 
      className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in p-4"
      aria-modal="true" role="dialog" aria-labelledby="refine-tutorial-title"
    >
      <div className="gradient-card rounded-3xl max-w-md w-full text-center transform scale-95 animate-scale-in relative p-6 sm:p-8">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-text-color-soft hover:text-text-color transition-colors" 
          aria-label="Cerrar tutorial de refinamiento"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <currentStep.icon className="w-12 h-12 fill-current text-primary-accent" /> 
            </div>
        </div>

        <h3 id="refine-tutorial-title" className="text-4xl sm:text-5xl font-bold mb-4 main-title title-gradient leading-tight text-center"> 
          {currentStep.title}
        </h3>
        
        <p className="text-text-color-soft text-md sm:text-lg mb-8 min-h-[100px] sm:min-h-[120px] flex items-center justify-center text-center"> 
          {currentStep.text}
        </p>

        <div className="flex justify-center gap-2 mb-8">
            {TUTORIAL_STEPS.map((_, index) => (
                <div key={index} className={`w-3 h-3 rounded-full transition-colors ${step === index ? 'bg-primary-accent' : 'bg-text-color-soft'}`}></div> 
            ))}
        </div>

        <div className="grid grid-cols-3 items-center gap-4"> 
            <button 
              onClick={handlePrev} 
              disabled={step === 0}
              className="btn-pill-base btn-main-action disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Paso anterior del tutorial"
            >
              <div className="icon-orb"><ChevronLeftIcon className="w-5 h-5"/></div> <span>Atrás</span>
            </button>
            <button 
              onClick={onClose} 
              className="btn-pill-base btn-secondary-action"
              aria-label="Cerrar tutorial"
            >
              <div className="icon-orb"><CloseIcon className="w-5 h-5"/></div> <span>Cerrar</span>
            </button>
            <button 
              onClick={isLastStep ? onClose : handleNext} 
              className="btn-pill-base btn-main-action"
              aria-label={isLastStep ? "Finalizar tutorial" : "Siguiente paso del tutorial"}
            >
              <div className="icon-orb">{isLastStep ? <SparklesIcon className="w-5 h-5"/> : <ChevronRightIcon className="w-5 h-5"/>}</div>
              <span>{isLastStep ? '¡Empieza a Refinar!' : 'Siguiente'}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default RefineTutorial;