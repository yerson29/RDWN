import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StyleVariation, Iteration, ImageBase64, Project } from '../types';
import ImageWithFallback from './ImageWithFallback';
// Se añade CloseIcon a la importación
import { RevertIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon, MagicWandIcon, CloseIcon } from './icons/Icons';
import { ImageComparator } from './UtilityComponents'; 
import RefineTutorial from './RefineTutorial'; 
import VoiceInputButton from './VoiceInputButton';

interface RefinementPanelProps {
  project: Project; 
  styleVariation: StyleVariation;
  onGenerateRefinement: (base64Data: string, mimeType: string, prompt: string, styleName: string, projectAnalysis: string) => Promise<{ newImage: ImageBase64; newDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'> }>; 
  onCommitRefinement: (projectId: string, styleName: string, prompt: string, generatedImage: ImageBase64, generatedDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'>, currentIterationIndex: number) => void; 
  currentIterationIndex: number;
  onSelectIteration: (index: number) => void;
  showRefineTutorial: boolean; 
  setShowRefineTutorial: React.Dispatch<React.SetStateAction<boolean>>; 
}

export const RefinementPanel: React.FC<RefinementPanelProps> = ({ 
  project,
  styleVariation, 
  onGenerateRefinement, 
  onCommitRefinement, 
  currentIterationIndex, 
  onSelectIteration,
  showRefineTutorial, 
  setShowRefineTutorial, 
}) => {
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [isGeneratingRefinement, setIsGeneratingRefinement] = useState(false);
  const [previewImageBase64, setPreviewImageBase64] = useState<ImageBase64 | null>(null);
  const [previewDetails, setPreviewDetails] = useState<Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'> | null>(null);
  const [refinementError, setRefinementError] = useState<string | null>(null);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
        const hasSeenRefineTutorial = localStorage.getItem('universo-suenos-refine-tutorial-seen');
        if (!hasSeenRefineTutorial) {
            setShowRefineTutorial(true);
            localStorage.setItem('universo-suenos-refine-tutorial-seen', 'true');
        }
        isFirstRender.current = false;
    }
  }, [setShowRefineTutorial]);

  const allContent = useMemo(() => [styleVariation, ...styleVariation.iterations], [styleVariation]);
  const currentContent = allContent[currentIterationIndex];
  const latestBase64Image = currentContent?.imageBase64;
  const latestImageUrl = currentContent?.imageUrl;

  const canGoBack = currentIterationIndex > 0;
  const canGoForward = currentIterationIndex < styleVariation.iterations.length;

  const handleGoBack = () => {
    if (canGoBack) onSelectIteration(currentIterationIndex - 1);
  };

  const handleGoForward = () => {
    if (canGoForward) onSelectIteration(currentIterationIndex + 1);
  };

  const handleGeneratePreview = useCallback(async () => {
    if (!refinementPrompt.trim() || !latestBase64Image?.data) {
      setRefinementError("Por favor, escribe tus ideas antes de generar la vista previa.");
      return;
    }
    setIsGeneratingRefinement(true);
    setRefinementError(null);
    try {
      const result = await onGenerateRefinement(
        latestBase64Image.data,
        latestBase64Image.mimeType,
        refinementPrompt,
        styleVariation.style_name,
        project.analysis
      );
      setPreviewImageBase64(result.newImage);
      setPreviewDetails(result.newDetails);
    } catch (error: any) {
      setRefinementError(error.message || "Un hechizo inesperado ha interrumpido la vista previa. Intenta de nuevo.");
      setPreviewImageBase64(null);
      setPreviewDetails(null);
    } finally {
      setIsGeneratingRefinement(false);
    }
  }, [refinementPrompt, latestBase64Image, onGenerateRefinement, styleVariation.style_name, project.analysis]);

  const handleApplyRefinement = () => {
    if (previewImageBase64 && previewDetails) {
      onCommitRefinement(
        project.id, styleVariation.style_name, refinementPrompt,
        previewImageBase64, previewDetails, currentIterationIndex
      );
      setRefinementPrompt('');
      setPreviewImageBase64(null);
      setPreviewDetails(null);
    }
  };
  
  const handleCancelRefinement = () => {
    setRefinementPrompt('');
    setPreviewImageBase64(null);
    setPreviewDetails(null);
    setRefinementError(null);
  };
  
  useEffect(() => {
    handleCancelRefinement();
  }, [styleVariation, currentIterationIndex]);

  return (
    <div className="flex flex-col h-full">
        {showRefineTutorial && <RefineTutorial onClose={() => setShowRefineTutorial(false)} />}
        <h3 className="text-3xl main-title title-gradient text-center mb-4">Refina tu Sueño</h3>

        <div className="relative aspect-video rounded-xl mb-6 shadow-xl">
            <ImageComparator
                before={latestImageUrl || null}
                after={previewImageBase64?.data ? `data:${previewImageBase64.mimeType};base64,${previewImageBase64.data}` : (latestImageUrl || null)}
            />
            {isGeneratingRefinement && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10 animate-fade-in">
                    <MagicWandIcon className="w-12 h-12 text-primary-accent animate-spin-slow animate-sparkle-glow mb-4" />
                    <p className="text-primary-accent font-semibold text-lg animate-fade-in-out">Tejiendo un nuevo sueño...</p>
                </div>
            )}
        </div>

        {refinementError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 text-sm error-message-card animate-pop-in" role="alert">
                {refinementError}
            </div>
        )}

        <div className="flex items-center justify-between gap-2 mb-4">
            <button
                onClick={handleGoBack}
                disabled={!canGoBack || isGeneratingRefinement || !!previewImageBase64}
                className="btn-solid-icon btn-solid-icon-purple disabled:opacity-50 disabled:cursor-not-allowed" /* Using btn-solid-icon-purple */
                aria-label="Deshacer cambio de diseño" title="Deshacer"
            >
                <ChevronLeftIcon className="w-6 h-6"/>
            </button>
            <span className="text-sm text-text-color-soft font-semibold">
                {`Versión ${currentIterationIndex + 1} / ${styleVariation.iterations.length + 1}`}
            </span>
            <button
                onClick={handleGoForward}
                disabled={!canGoForward || isGeneratingRefinement || !!previewImageBase64}
                className="btn-solid-icon btn-solid-icon-purple disabled:opacity-50 disabled:cursor-not-allowed" /* Using btn-solid-icon-purple */
                aria-label="Rehacer cambio de diseño" title="Rehacer"
            >
                <ChevronRightIcon className="w-6 h-6"/>
            </button>
        </div>
        
        <div className="relative w-full mb-4">
            <textarea
                value={refinementPrompt}
                onChange={(e) => setRefinementPrompt(e.target.value)}
                placeholder="¿Qué magia quieres agregar? Describe tu idea (ej. 'añade un cuadro abstracto en la pared', 'cambia el color del sofá a azul marino', 'haz la iluminación más cálida')."
                rows={4}
                className="w-full p-3 pr-12 border border-secondary-accent/50 rounded-lg bg-gray-50 text-text-color focus:ring-2 focus:ring-primary-accent transition shadow-sm"
                disabled={isGeneratingRefinement || !!previewImageBase64}
                aria-label="Describe tus ideas para refinar el diseño"
            ></textarea>
            <VoiceInputButton onResult={(text) => setRefinementPrompt(prev => prev + text)} />
        </div>


        {previewImageBase64 ? (
            <div className="flex gap-4 mt-auto animate-pop-in">
                <button
                    onClick={handleApplyRefinement}
                    className="flex-grow btn-pill-base btn-main-action transform hover:scale-105 transition-transform"
                    aria-label="Aplicar este refinamiento al diseño"
                >
                    <div className="icon-orb"><SparklesIcon className="w-5 h-5 animate-sparkle-glow"/></div>
                    <span>Aplicar Refinamiento</span>
                </button>
                <button
                    onClick={handleCancelRefinement}
                    className="btn-pill-base btn-secondary-action transform hover:scale-105 transition-transform" /* Using btn-secondary-action */
                    aria-label="Cancelar la vista previa y volver al diseño anterior"
                >
                    <div className="icon-orb"><CloseIcon className="w-5 h-5"/></div>
                    <span>Cancelar</span>
                </button>
            </div>
        ) : (
            <button
                onClick={handleGeneratePreview}
                disabled={!refinementPrompt.trim() || isGeneratingRefinement}
                className="w-full px-6 py-3 btn-pill-base btn-main-action disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-auto transform hover:scale-105 transition-transform"
                aria-label="Generar vista previa del refinamiento"
            >
                {isGeneratingRefinement ? (
                    <>
                        <div className="icon-orb"><SparklesIcon className="w-5 h-5 animate-spin"/></div>
                        <span>Generando Vista Previa...</span>
                    </>
                ) : (
                    <>
                        <div className="icon-orb"><SparklesIcon className="w-5 h-5 animate-sparkle-glow"/></div>
                        <span>Generar Vista Previa</span>
                    </>
                )}
            </button>
        )}
    </div>
  );
};