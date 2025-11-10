
import React, { useState, useCallback, useRef } from 'react';
import { Project } from '../types';
// Se agregaron las importaciones de iconos faltantes desde el archivo de iconos.
import { UploadIcon, CameraIcon, DocumentIcon, HeartIcon, MagicIcon, ViewIcon, SparklesIcon, StarDustIcon, MagicWandIcon, DreamHeartIcon } from './icons/Icons';
import ImageWithFallback from './ImageWithFallback';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
     if (!selectedFile) return;

     if (!selectedFile.type.startsWith('image/')) {
        alert("Por favor, elige un archivo de imagen.");
        return;
     }

     if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        alert(`El archivo es muy grande. Elige uno de menos de ${MAX_FILE_SIZE_MB} MB, por favor.`);
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
    ref.current?.click();
  };

  const removePreview = () => {
      setPreview(null);
      setFile(null);
  }
  
  const handleSubmit = () => {
    if (file) {
      onImageUpload(file);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        <div className="text-center p-4 rounded-3xl w-full">
             <div className="flex items-center justify-center gap-2">
                <SparklesIcon className="w-12 h-12 title-gradient" />
                <h1 className="text-6xl main-title title-gradient">
                  Rosi Decora
                </h1>
              </div>
            <h2 className="text-2xl sm:text-3xl title-gradient mt-2">
                ¡Transforma tu Espacio con tu Universo de Sueños!
            </h2>
        </div>
        
        <div className="gradient-card rounded-3xl w-full p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-center main-title mb-6">Camina al Universo de Sueños</h3>
            
            {/* Horizontal Icons for Steps with text below */}
            <div className="flex justify-around items-start text-center gap-4 mb-4">
                <div className="w-1/4 flex flex-col items-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-1">
                        <StarDustIcon className="w-7 h-7 fill-current text-primary-accent" /> {/* Changed DocumentIcon to StarDustIcon */}
                    </div>
                    <span className="text-sm text-text-color font-semibold mb-2">Paso 1: Sube una foto de ese rincón especial que tu corazón anhela transformar.</span> {/* Combined text and description */}
                </div>
                <div className="w-1/4 flex flex-col items-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-1">
                        <MagicWandIcon className="w-7 h-7 fill-current text-primary-accent" /> {/* Changed MagicIcon to MagicWandIcon */}
                    </div>
                    <span className="text-sm text-text-color font-semibold mb-2">Paso 2: Tu universo de ideas te mostrará 5 hermosos estilos para tu espacio.</span>
                </div>
                <div className="w-1/4 flex flex-col items-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-1">
                        <ViewIcon className="w-7 h-7 fill-current text-primary-accent" /> {/* Changed text-white to text-primary-accent */}
                    </div>
                    <span className="text-sm text-text-color font-semibold mb-2">Paso 3: Explora cada idea, descubre los muebles y los colores que vibran con tu espíritu.</span>
                </div>
                <div className="w-1/4 flex flex-col items-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-1">
                        <DreamHeartIcon className="w-7 h-7 fill-current text-primary-accent" /> {/* Changed HeartIcon to DreamHeartIcon */}
                    </div>
                    <span className="text-sm text-text-color font-semibold mb-2">Paso 4: Cuéntale tus ideas y tu universo de sueños las hará realidad. ¡Guarda las joyas de tu inspiración!</span>
                </div>
            </div>
        </div>

      <div className="w-full text-center mt-8">
        <UploadIcon className="w-16 h-16 text-secondary-accent mx-auto animate-bounce" />
        <h3 className="text-3xl sm:text-4xl main-title title-gradient mt-2">Elige el Rincón que tu Corazón Anhela Transformar</h3>
        <p className="text-text-color-soft mt-1">Arrastra una foto o elígela desde tu dispositivo</p>
      </div>

      {!preview ? (
        <form 
          className={`w-full max-w-2xl h-64 border-4 border-dashed rounded-3xl flex flex-col justify-center items-center text-center p-4 transition-all duration-300 ${dragActive ? 'border-primary-accent bg-pink-50' : 'border-secondary-accent/50 bg-white'}`} /* Changed bg-pink-50 to bg-white for consistency with new card style */
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          aria-label="Área para subir la foto de tu espacio"
        >
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} aria-label="Seleccionar archivo de imagen"/>
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} aria-label="Tomar foto con la cámara"/>
          <p className="text-text-color-soft mb-4">Arrastra aquí la foto de tu rincón especial</p> {/* Changed text-white/70 to text-text-color-soft */}
          <div className="flex flex-row gap-4"> {/* Changed sm:flex-row to flex-row to ensure horizontal layout on all screen sizes */}
              <button type="button" onClick={() => onButtonClick(fileInputRef)} className="px-8 py-3 btn-primary" aria-label="Seleccionar archivo desde el sistema">
                Elige una Foto
              </button>
              <button type="button" onClick={() => onButtonClick(cameraInputRef)} className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gray-200 text-gray-700 font-semibold shadow-lg hover:scale-105 transition-transform" aria-label="Usar la cámara para tomar una foto"> {/* Adjusted button styling */}
                <CameraIcon className="w-6 h-6"/>
                Usa la Cámara
              </button>
          </div>
          {/* New "Regenerar" button */}
          <button type="button" onClick={() => onButtonClick(fileInputRef)} className="mt-4 px-8 py-3 btn-primary" aria-label="Generar nuevas ideas para tu espacio">
              ¿Qué nueva inspiración anhela tu corazón hoy?
          </button>
        </form>
      ) : (
        <div className="gradient-card rounded-3xl p-4 w-full max-w-2xl">
          <div className="relative aspect-video">
            <ImageWithFallback 
                src={preview} 
                alt="Vista previa de tu espacio" 
                className="w-full h-full object-cover rounded-2xl" 
                fallbackIconClassName="w-1/3 h-1/3"
                loading="eager" // La imagen de vista previa es inmediatamente visible
            />
            <button onClick={removePreview} className="absolute -top-3 -right-3 bg-white text-red-500 rounded-full p-2 shadow-lg hover:bg-red-500 hover:text-white transition-all" aria-label="Quitar esta foto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <button onClick={handleSubmit} className="mt-6 w-full py-4 text-lg btn-primary" aria-label="Generar diseños mágicos para la imagen subida">
            Que el Diseño Comience
          </button>
        </div>
      )}

      {recentProjects.length > 0 && (
          <div className="w-full mt-16">
              <h3 className="text-3xl sm:text-4xl main-title title-gradient text-center mb-6">Tus Inspiraciones Recientes</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {recentProjects.map(project => (
                      <div 
                          key={project.id}
                          onClick={() => onViewProject(project.id)}
                          className="gradient-card rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                          role="button"
                          aria-label={`Ver la inspiración: ${project.name}`}
                      >
                          <ImageWithFallback 
                              src={project.originalImage} 
                              alt={project.name} 
                              className="w-full h-32 object-cover" 
                              fallbackIconClassName="w-1/3 h-1/3"
                              loading="lazy"
                          />
                          <div className="p-3">
                              <h4 className="font-bold text-base sm:text-lg truncate">{project.name}</h4> {/* Removed text-white */}
                              <p className="text-xs sm:text-sm text-text-color-soft">Creado el: {new Date(project.createdAt).toLocaleDateString()}</p> {/* Changed text-white/70 to text-text-color-soft */}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default ImageUpload;