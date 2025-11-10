import React, { useState } from 'react';
// Se agregaron las importaciones de iconos faltantes desde el archivo de iconos.
import { ChevronLeftIcon, ChevronRightIcon, MagicBookIcon, SparklesIcon, CloseIcon, ViewIcon, DreamHeartIcon } from './icons/Icons'; // Asegúrate de DreamHeartIcon

interface RefineTutorialProps {
  onClose: () => void;
}

const TUTORIAL_STEPS = [
  {
    icon: ViewIcon,
    title: "Paso 1: ¡Explora Universos de Estilo!",
    text: "Mira los 5 estilos que tu universo de sueños ha creado para ti. Haz clic en el que más te susurre para seleccionarlo y ver sus detalles. ¡Tu inspiración te guiará!",
  },
  {
    icon: MagicBookIcon,
    title: "Paso 2: ¡Tu Visión Es el Secreto!",
    text: "En el panel de la derecha, verás un área para escribir tus ideas. Cuéntale a tu universo qué quieres cambiar o mejorar en el diseño actual. ¡Sé tan detallada como desees!",
  },
  {
    icon: SparklesIcon,
    title: "Paso 3: ¡Da Vida a tu Idea!",
    text: "Una vez que hayas escrito tu magia, haz clic en el botón 'Transformar'. Tu universo de sueños trabajará para crear una nueva versión de tu diseño, incorporando tus susurros. ¡Observa la evolución!",
  },
  {
    icon: DreamHeartIcon, 
    title: "Paso 4: Viaja en el Tiempo de tu Inspiración",
    text: "Usa los pequeños recuadros con imágenes debajo del campo de texto para navegar por todas las versiones de tu diseño. Podrás ver la evolución desde el original hasta tus últimas refinaciones. ¡Cada paso es una joya!",
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
              className="px-6 py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Paso anterior del tutorial"
            >
              <ChevronLeftIcon className="w-5 h-5"/> Atrás
            </button>
            <button 
              onClick={onClose} 
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold shadow-md hover:scale-105 transition-transform"
              aria-label="Cerrar tutorial"
            >
              Cerrar
            </button>
            <button 
              onClick={isLastStep ? onClose : handleNext} 
              className="px-6 py-3 rounded-xl btn-primary text-white font-semibold flex items-center justify-center gap-2"
              aria-label={isLastStep ? "Finalizar tutorial" : "Siguiente paso del tutorial"}
            >
              {isLastStep ? '¡Empieza a Refinar!' : 'Siguiente'}
              {!isLastStep && <ChevronRightIcon className="w-5 h-5"/>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default RefineTutorial;