import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, DocumentIcon, DreamHeartIcon, MagicWandIcon, SparklesIcon, CloseIcon, StarDustIcon, ViewIcon } from './icons/Icons'; // Asegúrate de ViewIcon si lo usas en el tutorial

interface TutorialProps {
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    icon: StarDustIcon,
    title: "¡Elige tu Lienzo Mágico!",
    text: "Te invitamos a empezar tu aventura. Sube esa foto especial de tu espacio o captura un nuevo momento con la cámara. ¡Este es el primer trazo de tu obra de arte!",
  },
  {
    icon: ViewIcon, // Cambiado a ViewIcon para este paso
    title: "Paso 2: ¡Explora Universos de Estilo!",
    text: "Con un toque de magia, tu universo de sueños te revelará 5 estilos únicos para tu rincón. Desliza, sueña y déjate llevar por la inspiración que cada diseño te ofrece. ¡Cada uno tiene un alma esperando a ser descubierto por ti!",
  },
  {
    icon: SparklesIcon,
    title: "Paso 3: ¡Da Vida a tu Visión!",
    text: "Aquí es donde tu inspiración toma las riendas. Cuéntanos qué detalles sueñas para perfeccionar tu diseño. ¿Un toque de color, un mueble distinto, o un ambiente más acogedor? ¡Tu universo de sueños será tu cómplice para hacerlo realidad!",
  },
  {
    icon: DreamHeartIcon,
    title: "Paso 4: ¡Guarda tus Tesoros Inspiradores!",
    text: "Si un diseño te hace suspirar, atesóralo en tus 'Favoritos'. Así, tendrás siempre a mano esas joyas de inspiración que te llenan de alegría. ¡No olvides que puedes visitarlas y revivirlas cuando quieras!",
  }
];

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => setStep(prev => Math.min(prev + 1, TUTORIAL_STEPS.length - 1));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 0));

  const isLastStep = step === TUTORIAL_STEPS.length - 1;
  const currentStep = TUTORIAL_STEPS[step];

  return (
    <div 
      className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in p-4"
      aria-modal="true" role="dialog" aria-labelledby="tutorial-title"
    >
      <div className="gradient-card rounded-3xl max-w-md w-full text-center transform scale-95 animate-scale-in relative p-6 sm:p-8">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-text-color-soft hover:text-text-color transition-colors transform hover:scale-110"
          aria-label="Cerrar tutorial"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shadow-md animate-pop-in">
                <currentStep.icon className="w-12 h-12 fill-current text-primary-accent animate-sparkle-glow" />
            </div>
        </div>

        <h3 id="tutorial-title" className="text-4xl sm:text-5xl font-bold mb-4 main-title title-gradient leading-tight text-center">
          {currentStep.title}
        </h3>
        
        <p className="text-text-color-soft text-md sm:text-lg mb-8 min-h-[100px] sm:min-h-[120px] flex items-center justify-center text-center">
          {currentStep.text}
        </p>

        <div className="flex justify-center gap-2 mb-8">
            {TUTORIAL_STEPS.map((_, index) => (
                <div key={index} className={`w-3 h-3 rounded-full transition-colors ${step === index ? 'bg-primary-accent shadow-md' : 'bg-text-color-soft'}`}></div>
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
              <span>{isLastStep ? '¡Que el Diseño Comience!' : 'Siguiente'}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;