import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { CloseIcon, ChatIcon, UserIcon, SparklesIcon, ExternalLinkIcon } from './icons/Icons';
import { ChatMessage, GroundingUrl } from '../types';
import VoiceInputButton from './VoiceInputButton';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

const CHATBOT_SUGGESTIONS = [
  "Cuéntame sobre las últimas tendencias en diseño de interiores.",
  "¿Cómo puedo hacer que un espacio pequeño se vea más grande?",
  "Dame ideas para combinar colores en un dormitorio.",
  "¿Cuáles son los mejores materiales sostenibles para muebles?",
  "Sugiere estilos para una cocina moderna y funcional."
];

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, chatHistory, onSendMessage, isSending }) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isSending) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tu Asistente de Diseño" cardClassName="gradient-card" titleClassName="title-gradient">
      <div className="flex flex-col h-[60vh]">
        <div className="flex-grow overflow-y-auto p-4 space-y-4 rounded-lg bg-gray-50 mb-4 border border-gray-200">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`flex flex-col gap-1 p-3 rounded-lg max-w-[80%] break-words shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary-accent text-white rounded-br-none'
                    : 'bg-white text-text-color rounded-bl-none border border-gray-100'
                }`}
                role="region"
                aria-label={`${msg.role === 'user' ? 'Tu mensaje' : 'Mensaje del asistente'}`}
              >
                {msg.role === 'model' && <SparklesIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-secondary-accent" />}
                {msg.parts.map((part, pIdx) => (
                  <React.Fragment key={pIdx}>
                    {part.text && <p className="text-sm whitespace-pre-wrap">{part.text}</p>}
                    {part.groundingUrls && part.groundingUrls.length > 0 && (
                      <div className="mt-2 text-xs text-text-color-soft flex flex-col gap-1 pt-2 border-t border-gray-100" role="complementary" aria-label="Fuentes de información">
                        <p className="font-semibold text-text-color">Fuentes:</p>
                        {part.groundingUrls.map((url: GroundingUrl, urlIdx: number) => (
                          <a
                            key={urlIdx}
                            href={url.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-secondary-accent hover:underline hover:text-primary-accent transition-colors"
                            aria-label={`Abrir fuente: ${url.title}`}
                          >
                            <ExternalLinkIcon className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{url.title}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
                {msg.role === 'user' && <UserIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-pink-100" />}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 p-3 rounded-lg rounded-bl-none bg-white text-text-color shadow-sm border border-gray-100">
                <SparklesIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-secondary-accent animate-pulse" />
                <p className="text-sm italic">Tu asistente de diseño está tejiendo su respuesta...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex flex-wrap gap-2 mb-3 justify-center">
          {CHATBOT_SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="rounded-full px-4 py-2 text-sm bg-gray-100 text-text-color-soft border border-gray-200 hover:bg-gray-200 transition-colors"
              disabled={isSending}
              aria-label={`Sugerencia de chat: ${suggestion}`}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Pregúntale a tu asistente..."
              className="w-full p-3 pr-12 border border-secondary-accent/50 rounded-lg bg-white text-text-color focus:ring-2 focus:ring-primary-accent transition"
              disabled={isSending}
              aria-label="Introduce tu mensaje para tu asistente de diseño"
            />
            <VoiceInputButton onResult={setInputMessage} />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="btn-pill-base btn-main-action p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Enviar mensaje"
          >
            <div className="icon-orb"><ChatIcon className="w-6 h-6" /></div>
            {isSending ? (
              <SparklesIcon className="w-6 h-6 animate-spin" />
            ) : (
              <span>Enviar</span>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default Chatbot;