import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/Icons'; // Usamos SparklesIcon para un fallback más tierno

interface ImageWithFallbackProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
  fallbackIconClassName?: string;
  loading?: 'lazy' | 'eager'; 
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className, fallbackIconClassName, loading = 'lazy' }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false); 

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsImageLoaded(false); 
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setIsImageLoaded(true); 
    // console.error(`Error loading image for ${alt}: ${src}`); // Removido para no alarmar al usuario
  };

  const handleLoad = () => {
    setIsImageLoaded(true);
  };

  if (hasError || !imgSrc) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className || ''}`} aria-label={`Imagen no disponible para ${alt}`}>
        <SparklesIcon className={fallbackIconClassName || "w-1/2 h-1/2 text-primary-accent animate-sparkle-glow"} /> 
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      {/* Shimmer effect when image is not loaded and no error */}
      {!isImageLoaded && !hasError && (
        <div className={`absolute inset-0 shimmer-effect ${className}`} aria-hidden="true" style={{ opacity: isImageLoaded ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}></div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className || ''} ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} 
        onError={handleError}
        onLoad={handleLoad}
        loading={loading} 
        style={{ transition: 'opacity 0.5s ease-in-out' }} 
      />
    </div>
  );
};

export default ImageWithFallback;