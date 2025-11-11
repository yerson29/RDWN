import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ClipboardIcon, ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';
import ImageWithFallback from './ImageWithFallback';

// ImageComparator Component
export const ImageComparator: React.FC<{ before: string; after: string }> = ({ before, after }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPos(percent);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const onMouseMove = (moveEvent: MouseEvent) => handleMove(moveEvent.clientX);
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const onTouchMove = (touchEvent: TouchEvent) => handleMove(touchEvent.touches[0].clientX);
        const onTouchEnd = () => {
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);
        };
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
    };

    return (
        <div 
            ref={containerRef} 
            className="image-comparator w-full aspect-video select-none rounded-xl"
            role="group"
            aria-label="Comparador de imágenes: antes y después del diseño"
        >
            <ImageWithFallback src={after} alt="Diseño después" className="object-cover w-full h-full" loading="eager" /> {/* Images in comparator are immediately visible */}
            <div className="before-wrapper" style={{ width: `${sliderPos}%` }}>
                <ImageWithFallback src={before} alt="Diseño antes" className="object-cover w-full h-full" loading="eager" /> {/* Images in comparator are immediately visible */}
            </div>
            <div
                className="slider"
                style={{ left: `${sliderPos}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                role="slider"
                aria-label="Desliza para comparar la imagen original y el diseño actual"
                aria-valuenow={Math.round(sliderPos)}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
            >
                <div className="slider-handle">
                    <span className="sr-only">Arrastrar para comparar</span>
                </div>
            </div>
        </div>
    );
};

// Tabs Component
export const Tabs: React.FC<{
    tabs: { label: string; content: React.ReactNode }[];
    defaultActiveTabLabel?: string; // Cambiado de initialActiveTabLabel
}> = ({ tabs, defaultActiveTabLabel }) => { // Cambiado de initialActiveTabLabel
    const [activeTab, setActiveTab] = useState(0);

    // Effect to set initial tab based on prop
    useEffect(() => {
        if (defaultActiveTabLabel) { // Cambiado de initialActiveTabLabel
            const initialIndex = tabs.findIndex(tab => tab.label === defaultActiveTabLabel); // Cambiado de initialActiveTabLabel
            if (initialIndex !== -1) {
                setActiveTab(initialIndex);
            }
        } else {
            setActiveTab(0); // Default to first tab if no initial label or not found
        }
    }, [defaultActiveTabLabel, tabs]); // Cambiado de initialActiveTabLabel

    return (
        <div>
            <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(index)}
                            className={`${
                                activeTab === index
                                    ? 'border-primary-accent text-primary-accent'
                                    : 'border-transparent text-text-color-soft hover:text-text-color hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            aria-selected={activeTab === index}
                            role="tab"
                            id={`tab-${tab.label}`}
                            aria-controls={`tabpanel-${tab.label}`}
                            tabIndex={activeTab === index ? 0 : -1}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            {tabs.map((tab, index) => (
                <div 
                    key={tab.label} 
                    role="tabpanel" 
                    id={`tabpanel-${tab.label}`} 
                    aria-labelledby={`tab-${tab.label}`} 
                    hidden={activeTab !== index}
                >
                    {tab.content}
                </div>
            ))}
        </div>
    );
};

// ColorPalette Component
export const ColorPalette: React.FC<{ palette: string[] }> = ({ palette }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        const textToCopy = palette.join(', ');
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div>
            <div className="flex flex-wrap gap-3" role="list" aria-label="Paleta de colores del estilo">
                {palette.map((color, index) => (
                    <div key={index} className="w-12 h-12 rounded-full shadow-md border-2 border-white" style={{ backgroundColor: color }} title={color} role="listitem" aria-label={`Color ${color}`}></div>
                ))}
            </div>
            <button onClick={handleCopy} className="mt-4 flex items-center gap-2 text-sm font-semibold text-text-color hover:text-text-color-soft transition-colors" aria-live="polite">
                <ClipboardIcon className="w-4 h-4" />
                {copied ? '¡Copiado!' : 'Copiar Paleta'}
            </button>
        </div>
    );
};