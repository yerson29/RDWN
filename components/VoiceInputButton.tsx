import React, { useState, useEffect, useRef } from 'react';
import { MagicWandIcon, MicrophoneSlashIcon, SparklesIcon, CloseIcon } from './icons/Icons'; // Importa MagicWandIcon y SparklesIcon

interface VoiceInputButtonProps {
    onResult: (transcript: string) => void;
    onListeningChange?: (isListening: boolean) => void;
    className?: string;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onResult, onListeningChange, className }) => {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorType, setErrorType] = useState<string | null>(null);
    const [shouldDiscardResult, setShouldDiscardResult] = useState(false); // Nuevo estado para descartar el resultado
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError("Tu navegador no soporta el reconocimiento de voz. Intenta con Chrome.");
            setErrorType('unsupported');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'es-ES';

        recognition.onstart = () => {
            setIsListening(true);
            setShouldDiscardResult(false); // Reiniciar en el inicio
            if (onListeningChange) onListeningChange(true);
        };

        recognition.onend = () => {
            setIsListening(false);
            if (onListeningChange) onListeningChange(false);
        };

        recognition.onerror = (event: any) => {
            let friendlyError = `Error: ${event.error}`;
            setErrorType(event.error);
            if (event.error === 'not-allowed') {
                friendlyError = "Permiso de micrófono denegado. Haz clic aquí o habilítalo en la configuración de tu navegador.";
            } else if (event.error === 'no-speech') {
                friendlyError = "No se detectó voz. Intenta de nuevo.";
            } else if (event.error === 'network') {
                friendlyError = "Error de red para reconocimiento de voz.";
            }
            console.error("Error de reconocimiento de voz:", event.error);
            setError(friendlyError);
            setIsListening(false);
            if (onListeningChange) onListeningChange(false);
            setShouldDiscardResult(false); // Asegurarse de limpiar este estado también en caso de error
        };

        recognition.onresult = (event: any) => {
            if (shouldDiscardResult) { // Si se hizo clic en cancelar, ignorar el resultado
                setShouldDiscardResult(false); // Limpiar para la próxima vez
                return;
            }
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                onResult(finalTranscript);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [onResult, onListeningChange]); // shouldDiscardResult ya no necesita ser una dependencia aquí, se maneja internamente.

    const toggleListening = () => {
        if (!recognitionRef.current || errorType === 'not-allowed' || errorType === 'unsupported') {
            if (error) alert(error);
            return;
        };
        if (isListening) {
            // Este clic ahora es "Detener y enviar"
            setShouldDiscardResult(false); // Asegurarse de que no se descarte si el usuario pulsa el micrófono para detener
            recognitionRef.current.stop();
        } else {
            setError(null);
            setErrorType(null);
            setShouldDiscardResult(false); // Asegurarse de que sea falso antes de empezar
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("No se pudo iniciar el reconocimiento: ", e);
                setError("No se pudo iniciar el dictado. Por favor, recarga la página.");
                setErrorType('start-failed');
            }
        }
    };
    
    const handleCancelListening = () => {
        if (!recognitionRef.current || !isListening) return;
        setShouldDiscardResult(true); // Marcar para descartar el resultado
        recognitionRef.current.stop(); // Detener el reconocimiento
        // No es necesario setIsListening(false) aquí, `onend` lo manejará
        setError(null); // Limpiar errores pendientes
        setErrorType(null); // Limpiar tipo de error
        // No es necesario onListeningChange(false) aquí, `onend` lo manejará
    };

    if (errorType === 'not-allowed' || errorType === 'unsupported') {
        return (
            <button
                type="button"
                className={`absolute right-2 top-1/2 -translate-y-1/2 btn-circular-embossed bg-red-100 text-red-500 transition-colors cursor-help ${className}`}
                title={error || "Error de micrófono"}
                onClick={toggleListening}
                aria-label="Error de reconocimiento de voz: Micrófono no permitido"
            >
                <MicrophoneSlashIcon className="w-5 h-5" />
            </button>
        );
    }

    return (
        <>
            {isListening && (
                <button
                    type="button"
                    onClick={handleCancelListening}
                    className={`absolute right-14 top-1/2 -translate-y-1/2 btn-circular-embossed text-gray-500 hover:bg-gray-300 transition-colors ${className}`}
                    title="Cancelar dictado"
                    aria-label="Cancelar dictado por voz y descartar entrada"
                >
                    <CloseIcon className="w-5 h-5" /> {/* Use CloseIcon for cancel */}
                </button>
            )}
            <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-2 top-1/2 -translate-y-1/2 btn-circular-embossed ${
                    isListening ? 'active-listening' : 'text-text-color hover:bg-gray-300'
                } ${className}`}
                title={error || (isListening ? "Detener dictado y enviar" : "Empezar a dictar")}
                aria-label={isListening ? "Detener dictado por voz y enviar entrada" : "Iniciar dictado por voz"}
            >
                <MagicWandIcon className="w-5 h-5" />
            </button>
        </>
    );
};

export default VoiceInputButton;