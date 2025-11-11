import React, { useState } from 'react';
import { Comment } from '../types';
import { CommentIcon as DiaryIcon, BookOpenIcon } from './icons/Icons';

// YersonQuoteSection Component
export const YersonQuoteSection: React.FC<{ quote: string; timestamp: string }> = ({ quote, timestamp }) => (
    <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100 mb-6 text-center">
        <h4 className="text-xl font-bold main-title title-gradient mb-2">La Última Frase de Yerson</h4>
        <p className="text-text-color text-lg italic mb-2">"{quote}"</p>
        <p className="text-xs text-text-color-soft">{timestamp}</p>
    </div>
);

// DesignHoroscope Component
export const DesignHoroscope: React.FC<{ horoscope: string }> = ({ horoscope }) => {
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return (
        <div className="p-4 bg-pink-50/50 rounded-lg border border-pink-100 mb-6 text-center">
            <h4 className="text-xl font-bold main-title title-gradient mb-2">Tu Horóscopo de Diseño</h4>
            <p className="text-text-color text-sm mb-2">Para hoy, {today}, tu universo de sueños te susurra:</p>
            <p className="text-text-color text-lg font-semibold">"{horoscope}"</p>
        </div>
    );
};

// CommentsSection Component
export const CommentsSection: React.FC<{ comments: Comment[]; onSaveComment: (text: string) => void; }> = ({ comments, onSaveComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onSaveComment(newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div className="mt-2">
            <h4 className="text-2xl font-bold mb-4 main-title title-gradient">Tu Diario de Ideas</h4>
            <form onSubmit={handleSubmit} className="mb-6" aria-label="Añadir un nuevo comentario">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="¿Qué te susurra tu inspiración sobre este diseño?"
                    className="w-full p-3 border border-secondary-accent/50 rounded-lg bg-gray-50 text-text-color mb-3 focus:ring-2 focus:ring-primary-accent transition" 
                    rows={3}
                    aria-label="Campo de texto para nuevo pensamiento"
                ></textarea>
                <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="w-full px-6 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Guardar Pensamiento"
                >
                    Guardar Pensamiento
                </button>
            </form>

            <div className="space-y-4" role="list" aria-label="Comentarios del diseño">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="p-4 bg-pink-50/50 rounded-lg border border-pink-100" role="listitem">
                            <p className="text-text-color whitespace-pre-wrap">{comment.text}</p>
                            <p className="text-xs text-text-color-soft mt-2 text-right">
                                {new Date(comment.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg">
                        <DiaryIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-text-color-soft">Aún no has capturado tus pensamientos aquí. Tu diario te espera.</p>
                    </div>
                )}
            </div>
        </div>
    );
};