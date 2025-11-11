import React, { useState, useEffect } from 'react';
import { ImageIcon } from './icons/Icons'; // Assuming ImageIcon is available

interface ImageWithFallbackProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
  fallbackIconClassName?: string;
  loading?: 'lazy' | 'eager'; // Nuevo: Propiedad para la carga diferida
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className, fallbackIconClassName, loading = 'lazy' }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false); // New state to track if image is loaded

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsImageLoaded(false); // Reset loaded state when src changes
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setIsImageLoaded(true); // Treat error as "loaded" for the purpose of removing shimmer
    console.error(`Error loading image for ${alt}: ${src}`);
  };

  const handleLoad = () => {
    setIsImageLoaded(true);
  };

  // If src is null, undefined, or there's an actual error, show the fallback icon
  if (hasError || !imgSrc) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className || ''}`} aria-label={`Imagen no disponible para ${alt}`}>
        <ImageIcon className={fallbackIconClassName || "w-1/2 h-1/2"} /> {/* Default icon size */}
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`}>
      {/* Shimmer effect when image is not loaded and no error */}
      {!isImageLoaded && !hasError && (
        <div className={`absolute inset-0 shimmer-effect ${className}`} aria-hidden="true" style={{ opacity: isImageLoaded ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}></div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className || ''} ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} /* Control visibility with opacity */
        onError={handleError}
        onLoad={handleLoad}
        loading={loading} // Pasar la propiedad loading al elemento <img>
        style={{ transition: 'opacity 0.3s ease-in-out' }} // Smooth fade-in
      />
    </div>
  );
};

export default ImageWithFallback;