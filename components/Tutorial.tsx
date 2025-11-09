import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, DocumentIcon, HeartIcon, MagicIcon, SparklesIcon, CloseIcon } from './icons/Icons';

interface TutorialProps {
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    icon: DocumentIcon,
    title: "Paso 1: ¡Elige tu Lienzo Mágico!",
    text: "Te invitamos a empezar tu aventura. Sube esa foto especial de tu espacio o captura un nuevo momento con la cámara. ¡Este es el primer trazo de tu obra de arte!",
  },
  {
    icon: MagicIcon,
    title: "Paso 2: ¡Explora Universos de Estilo!",
    text: "Con un toque de magia, tu universo de sueños te revelará 5 estilos únicos para tu rincón. Desliza, sueña y déjate llevar por la inspiración que cada diseño te ofrece. ¡Cada uno tiene un alma esperando a ser descubierto por ti!",
  },
  {
    icon: SparklesIcon,
    title: "Paso 3: ¡Da Vida a tu Visión!",
    text: "Aquí es donde tu inspiración toma las riendas. Cuéntanos qué detalles sueñas para perfeccionar tu diseño. ¿Un toque de color, un mueble distinto, o un ambiente más acogedor? ¡Tu universo de sueños será tu cómplice para hacerlo realidad!",
  },
  {
    icon: HeartIcon,
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
      <div className="gradient-card rounded-3xl max-w-md w-full text-center transform scale-95 animate-scale-in relative p-6 sm:p-8"> {/* Removed border-white/50 */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Cerrar tutorial"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <currentStep.icon className="w-12 h-12 fill-current text-primary-accent" /> {/* Changed title-gradient to text-primary-accent */}
            </div>
        </div>

        <h3 id="tutorial-title" className="text-4xl sm:text-5xl font-bold mb-4 main-title title-gradient leading-tight text-center"> {/* Added text-center */}
          Cómo Crear tu Diseño Soñado
        </h3>
        
        <p className="text-text-color-soft text-md sm:text-lg mb-8 min-h-[100px] sm:min-h-[120px] flex items-center justify-center text-center"> {/* Changed text-white/70 to text-text-color-soft and added text-center */}
          {currentStep.text}
        </p>

        <div className="flex justify-center gap-2 mb-8">
            {TUTORIAL_STEPS.map((_, index) => (
                <div key={index} className={`w-3 h-3 rounded-full transition-colors ${step === index ? 'bg-primary-accent' : 'bg-text-color-soft'}`}></div> {/* Changed bg-gray-300 to bg-text-color-soft */}
            ))}
        </div>

        <div className="grid grid-cols-2 items-center gap-4">
            <button 
              onClick={onClose} 
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow-md hover:scale-105 transition-transform" /* Adjusted button styling */
              aria-label="Omitir tutorial"
            >
              Omitir
            </button>
            <button 
              onClick={isLastStep ? onClose : handleNext} 
              className="px-6 py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2"
              aria-label={isLastStep ? "Finalizar tutorial" : "Siguiente paso del tutorial"}
            >
              {isLastStep ? '¡Que el Diseño Comience!' : 'Siguiente'}
              {!isLastStep && <ChevronRightIcon className="w-5 h-5"/>}
            </button>
        </div>
        
         {step > 0 && (
            <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200" aria-label="Paso anterior del tutorial">
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
        )}
        {!isLastStep && (
            <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200" aria-label="Siguiente paso del tutorial">
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
            </button>
        )}
      </div>
    </div>
  );
};

export default Tutorial;