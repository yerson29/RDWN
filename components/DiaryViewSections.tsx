import React, { useState } from 'react';
import { Comment } from '../types';
import { CommentIcon as DiaryIcon, BookOpenIcon } from './icons/Icons';
import VoiceInputButton from './VoiceInputButton';

// YersonQuoteSection Component
export const YersonQuoteSection: React.FC<{ quote: string; timestamp: string }> = ({ quote, timestamp }) => (
    <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100 mb-6 text-center">
        <h4 className="text-xl font-bold main-title title-gradient mb-2">Un Mensaje para Rosi</h4>
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
            <p className="text-text-color-soft italic">"{horoscope}"</p>
        </div>
    );
};

interface CommentsSectionProps {
    comments: Comment[];
    onSaveComment: (text: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, onSaveComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSave = () => {
        if (newComment.trim()) {
            onSaveComment(newComment.trim());
            setNewComment('');
        }
    };

    return (
        <div className="border-t border-gray-200 pt-6">
            <h5 className="text-lg font-semibold text-text-color mb-4 flex items-center gap-2">
                <DiaryIcon className="w-5 h-5" />
                Notas de tu Diario de Sueños
            </h5>
            <div className="space-y-4 mb-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-white/50 p-3 rounded-lg text-sm text-text-color-soft">
                            <p className="whitespace-pre-wrap">{comment.text}</p>
                            <p className="text-xs text-right mt-1 opacity-70">{new Date(comment.createdAt).toLocaleString('es-ES')}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-text-color-soft italic text-center">Aún no has escrito nada sobre este sueño. ¡Deja que tus pensamientos fluyan!</p>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <div className="relative w-full">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe tus reflexiones, ideas o sentimientos sobre este sueño aquí..."
                        rows={3}
                        className="w-full p-2 pr-12 border border-secondary-accent/30 rounded-lg bg-gray-50 text-text-color focus:ring-2 focus:ring-primary-accent transition"
                        aria-label="Escribe una nueva nota en tu diario"
                    />
                    <VoiceInputButton onResult={(text) => setNewComment(prev => prev + text)} />
                </div>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 self-end btn-primary text-sm font-semibold rounded-lg"
                    aria-label="Guardar nota"
                >
                    Guardar Nota
                </button>
            </div>
        </div>
    );
};