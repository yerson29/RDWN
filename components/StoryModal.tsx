import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { BookOpenIcon, SparklesIcon, UserIcon } from './icons/Icons';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: string;
  storyStyleName: string;
  chatHistory: { role: string; parts: { text: string }[] }[];
  onRegenerate: (comments: string) => void;
  isLoading: boolean;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  isOpen,
  onClose,
  story,
  storyStyleName,
  chatHistory,
  onRegenerate,
  isLoading,
}) => {
  const [userComment, setUserComment] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the latest message in chat history
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userComment.trim()) {
      onRegenerate(userComment.trim());
      setUserComment('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`El Hilo de tu Historia: ${storyStyleName}`} cardClassName="gradient-card" titleClassName="title-gradient">
      <div className="flex flex-col h-full max-h-[70vh]">
        <div className="flex-grow overflow-y-auto pr-2 mb-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-primary-accent text-white' : 'bg-gray-100 text-text-color'}`}>
                {msg.parts.map((part, pIdx) => (
                  <p key={pIdx} className="text-sm whitespace-pre-wrap">{part.text}</p>
                ))}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="¿Cómo quieres que la historia continúe o cambie? Ej: 'Hazlo más misterioso' o 'Agrega un personaje solitario'..."
            className="w-full p-3 border border-secondary-accent/50 rounded-lg bg-gray-50 text-text-color focus:ring-2 focus:ring-primary-accent transition"
            rows={3}
            disabled={isLoading}
            aria-label="Introduce tus comentarios para regenerar la historia"
          ></textarea>
          <button
            type="submit"
            disabled={!userComment.trim() || isLoading}
            className="w-full px-6 py-3 rounded-xl btn-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            aria-label="Regenerar historia con tus comentarios"
          >
            {isLoading ? (
              <>
                <SparklesIcon className="w-5 h-5 animate-spin" />
                Tejiendo un Nuevo Capítulo...
              </>
            ) : (
              <>
                <BookOpenIcon className="w-5 h-5" />
                Regenerar Historia
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};