import React, { useState } from 'react';
import { Project, StyleVariation, Comment } from '../types';
import { YersonQuoteSection, DesignHoroscope, CommentsSection } from './DiaryViewSections';
import ImageWithFallback from './ImageWithFallback';
import { ChevronLeftIcon, CommentIcon as DiaryIcon } from './icons/Icons';

interface DiaryViewProps {
    project: Project;
    onNavigateBack: () => void;
    onSaveComment: (projectId: string, styleName: string, text: string) => void; // Recibe la función de App.tsx
}

const DiaryView: React.FC<DiaryViewProps> = ({ project, onNavigateBack, onSaveComment }) => {
    // Hardcoded quotes for DiaryView, similar to ProjectView for consistency
    const yersonQuote = "Cada espacio es una historia esperando ser contada, ¿cuál narrarás hoy?";
    const yersonQuoteTimestamp = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    const designHoroscope = "Hoy, la energía celestial alinea tus visiones con la funcionalidad. Un toque audaz en tu rincón especial desbloqueará un flujo de creatividad inesperado. ¡Confía en tus instintos!";

    if (!project) {
        return (
            <div className="text-center py-20 text-text-color-soft">
                <p>No se encontró el proyecto para mostrar el diario.</p>
                <button onClick={onNavigateBack} className="mt-4 px-6 py-2 btn-primary rounded-xl">Volver</button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onNavigateBack} className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors" aria-label="Volver al proyecto">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-4xl sm:text-5xl main-title font-bold title-gradient">Diario de {project.name}</h2>
            </div>

            <YersonQuoteSection quote={yersonQuote} timestamp={yersonQuoteTimestamp} />
            <DesignHoroscope horoscope={designHoroscope} />

            <div className="space-y-12 mt-12">
                {project.styleVariations.length > 0 ? (
                    project.styleVariations.map((variation) => (
                        <div key={variation.style_name} className="gradient-card p-6 rounded-3xl animate-fade-in">
                            <h3 className="text-3xl main-title title-gradient mb-4 text-center">{variation.style_name}</h3>
                            <ImageWithFallback
                                src={variation.imageUrl} // variation.imageUrl can be string | null
                                alt={`Diseño ${variation.style_name} del proyecto ${project.name}`}
                                className="w-full h-64 object-cover rounded-2xl mb-6 shadow-md"
                                fallbackIconClassName="w-1/3 h-1/3"
                                loading="lazy"
                            />
                            <p className="text-text-color-soft text-center italic mb-8">{variation.description}</p>
                            <CommentsSection
                                comments={variation.comments}
                                onSaveComment={(text) => onSaveComment(project.id, variation.style_name, text)} // Llama a la prop
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg text-text-color-soft">
                        <DiaryIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p>No hay variaciones de estilo en este proyecto para el diario.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiaryView;