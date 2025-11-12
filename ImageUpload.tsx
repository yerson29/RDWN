import React, { useState, useCallback, useRef } from 'react';
import { Project, ImageBase64 } from '../types';
import { CameraIcon, ViewIcon, SparklesIcon, StarDustIcon, MagicWandIcon, DreamHeartIcon } from './icons/Icons';
import ImageWithFallback from './ImageWithFallback';
import { inspirationStyleImages } from '../seedData'; 

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  recentProjects: Project[];
  onViewProject: (projectId: string) => void;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, recentProjects, onViewProject }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null); // New state for specific upload errors
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Helper to convert base64 to File object
  const base64ToFile = (base64: ImageBase64, fileName: string): File => {
    // Ensure base64.data is not null before proceeding
    if (!base64.data) throw new Error("ImageBase64 data cannot be null when converting to File.");

    const mime = base64.mimeType;
    // Decode base64 string to binary string
    const binaryString = atob(base64.data);
    
    // Create an ArrayBuffer from the binary string
    const len = binaryString.length;
    const u8arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        u8arr[i] = binaryString.charCodeAt(i);
    }
    
    // Create a Blob from the Uint8Array and then a File
    return new File([u8arr], fileName, { type: mime });
  };

  const handleFile = useCallback((selectedFile: File) => {
     setUploadError(null); // Clear previous errors
     if (!selectedFile) return;

     if (!selectedFile.type.startsWith('image/')) {
        setUploadError("Por favor, elige un archivo de imagen válido (JPG, PNG, WebP).");
        return;
     }
     
     // Explicitly reject GIFs
     if (selectedFile.type === 'image/gif') {
        setUploadError("Lo siento, las imágenes GIF no son compatibles. Por favor, usa JPG, PNG o WebP.");
        return;
     }

     if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`El archivo es muy grande. Elige uno de menos de ${MAX_FILE_SIZE_MB} MB, por favor.`);
        return;
     }
     
     setFile(selectedFile);
     setPreview(URL.createObjectURL(selectedFile));
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const onButtonClick = (ref: React.RefObject<HTMLInputElement>) => {
    setUploadError(null); // Clear errors before opening file dialog
    ref.current?.click();
  };

  const removePreview = () => {
      setPreview(null);
      setFile(null);
      setUploadError(null); // Clear errors
  }
  
  const handleSubmit = () => {
    if (file) {
      onImageUpload(file);
    }
  };

  const handleSelectPredefinedImage = (imageBase64: ImageBase64, name: string) => {
    // Check if data is null, prevent conversion to File if it is.
    if (!imageBase64.data) {
        setUploadError("No se puede usar esta imagen predefinida porque no tiene datos de imagen válidos.");
        return;
    }
    const predefinedFile = base64ToFile(imageBase64, `${name.replace(/\s/g, '_')}.jpeg`); // Ensure .jpeg extension
    onImageUpload(predefinedFile);
  };
  
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 animate-fade-in">
        <div className="text-center p-4 rounded-3xl w-full">
             <div className="flex items-center justify-center gap-2">
                <SparklesIcon className="w-10 h-10 title-gradient animate-sparkle-glow" /> {/* Adjusted icon size */}
                <h1 className="text-5xl main-title title-gradient"> {/* Reduced size for compactness */}
                  Rosi Decora
                </h1>
              </div>
        </div>
        
      <div className="w-full text-center mt-4"> {/* Reduced margin-top */}
        <h3 className="text-3xl sm:text-4xl main-title title-gradient mt-2">Elige el Rincón que tu Corazón Anhela Transformar</h3>
        <p className="text-text-color-soft mt-1">Arrastra una foto o elígela desde tu dispositivo</p>
      </div>

      {!preview ? (
        <form 
          className={`w-full max-w-2xl h-80 border-4 border-dashed rounded-3xl flex flex-col justify-center items-center text-center p-4 sm:p-6 transition-all duration-300 relative group
                     ${dragActive ? 'border-primary-accent bg-pink-50 shadow-lg scale-[1.01]' : 'border-secondary-accent/50 bg-white'}`}
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          aria-label="Área para subir la foto de tu espacio"
        >
            {dragActive && (
                <div className="absolute inset-0 border-4 border-primary-accent rounded-3xl animate-pulse-bright opacity-50 z-0"></div>
            )}
            <div className="relative z-10 flex flex-col items-center">
                <p className="text-text-color-soft mb-3 text-lg">Arrastra aquí la foto de tu rincón especial</p> {/* Adjusted margin-bottom */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4"> {/* Adjusted margin-bottom */}
                    <button type="button" onClick={() => onButtonClick(fileInputRef)} className="px-8 py-3 btn-pill-base btn-main-action animate-pop-in" aria-label="Seleccionar archivo desde el sistema">
                        <div className="icon-orb"><SparklesIcon className="w-6 h-6"/></div> {/* Icon within orb */}
                        <span>Elige una Foto</span>
                    </button>
                    <button type="button" onClick={() => onButtonClick(cameraInputRef)} className="btn-pill-base btn-secondary-action animate-pop-in" aria-label="Usar la cámara para tomar una foto"> {/* Using btn-secondary-action */}
                        <div className="icon-orb"><CameraIcon className="w-6 h-6"/></div> {/* Icon within orb */}
                        <span>Usa la Cámara</span>
                    </button>
                </div>
                {uploadError && (
                    <p className="text-red-500 text-sm mt-2 animate-pop-in">{uploadError}</p> {/* Adjusted margin-top */}
                )}
            </div>
        </form>
      ) : (
        <div className="gradient-card rounded-3xl p-4 w-full max-w-2xl animate-pop-in">
          <div className="relative aspect-video">
            <ImageWithFallback 
                src={preview} 
                alt="Vista previa de tu espacio" 
                className="w-full h-full object-cover rounded-2xl shadow-md" 
                fallbackIconClassName="w-1/3 h-1/3"
                loading="eager" 
            />
            <button onClick={removePreview} className="absolute -top-3 -right-3 bg-white text-red-500 rounded-full p-2 shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:scale-110" aria-label="Quitar esta foto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <button onClick={handleSubmit} className="mt-6 w-full py-4 btn-pill-base btn-main-action animate-pop-in" aria-label="Generar diseños mágicos para la imagen subida">
            <div className="icon-orb"><MagicWandIcon className="w-6 h-6"/></div> {/* Icon within orb */}
            <span>Que la Magia Comience</span>
          </button>
        </div>
      )}

      {recentProjects.length > 0 && (
          <div className="w-full mt-12 animate-fade-in"> {/* Reduced margin-top */}
              <h3 className="text-3xl sm:text-4xl main-title title-gradient text-center mb-6">Tus Proyectos Recientes</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {recentProjects.map(project => (
                      <div 
                          key={project.id}
                          onClick={() => onViewProject(project.id)}
                          className="gradient-card rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-pop-in"
                          role="button"
                          tabIndex={0}
                          aria-label={`Ver el proyecto: ${project.name}`}
                      >
                          <ImageWithFallback 
                              src={project.originalImage} 
                              alt={project.name} 
                              className="w-full h-32 object-cover" 
                              fallbackIconClassName="w-1/3 h-1/3"
                              loading="lazy"
                          />
                          <div className="p-3">
                              <h4 className="font-bold text-base sm:text-lg truncate text-text-color">{project.name}</h4>
                              <p className="text-xs sm:text-sm text-text-color-soft">Creado el: {new Date(project.createdAt).toLocaleDateString()}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {inspirationStyleImages.length > 0 && ( // Conditionally render only if there are actual images
          <div className="w-full mt-12 animate-fade-in"> {/* Reduced margin-top */}
              <h3 className="text-3xl sm:text-4xl main-title title-gradient text-center mb-6">Empieza con Inspiración</h3>
              <p className="text-text-color-soft text-center mb-8">
                  ¿No tienes una foto a mano? Elige una de estas inspiraciones para que la magia comience y cree un nuevo proyecto para ti.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {inspirationStyleImages.map(inspiration => (
                      <button
                          key={inspiration.id}
                          onClick={() => handleSelectPredefinedImage(inspiration.image, inspiration.name)}
                          className="gradient-card rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left animate-pop-in"
                          aria-label={`Seleccionar estilo predefinido: ${inspiration.name}`}
                          role="button"
                          tabIndex={0}
                      >
                          <ImageWithFallback
                              src={inspiration.image.data
                                  ? `data:${inspiration.image.mimeType};base64,${inspiration.image.data}`
                                  : null}
                              alt={inspiration.name}
                              className="w-full h-32 object-cover"
                              fallbackIconClassName="w-1/3 h-1/3"
                              loading="lazy"
                          />
                          <div className="p-3">
                              <h4 className="font-bold text-base sm:text-lg truncate text-text-color">{inspiration.name}</h4>
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default ImageUpload;