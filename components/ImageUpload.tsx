import React, { useState, useCallback, useRef } from 'react';
import { Project, ImageBase64 } from '../types';
import { UploadIcon, CameraIcon, DocumentIcon, HeartIcon, MagicIcon, ViewIcon, SparklesIcon, StarDustIcon, MagicWandIcon, DreamHeartIcon } from './icons/Icons';
import ImageWithFallback from './ImageWithFallback';
// FIX: Se actualiza la importación para que coincida con la exportación corregida en seedData.ts
import { inspirationStyleImages } from '../seedData'; // Import the new inspiration images

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  recentProjects: Project[];
  onViewProject: (projectId: string) => void;
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  setAspectRatio: React.Dispatch<React.SetStateAction<'1:1' | '3:4' | '4:3' | '9:16' | '16:9'>>;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, recentProjects, onViewProject, aspectRatio, setAspectRatio }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Helper to convert base64 to File object
  const base64ToFile = (base64: ImageBase64, fileName: string): File => {
    // Ensure base64.data is not null before proceeding
    if (!base64.data) throw new Error("ImageBase64 data cannot be null when converting to File.");

    const mime = base64.mimeType;
    const bstr = atob(base64.data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  };

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

  const handleSelectPredefinedImage = (imageBase64: ImageBase64, name: string) => {
    // Check if data is null, prevent conversion to File if it is.
    if (!imageBase64.data) {
        alert("No se puede usar esta imagen predefinida porque no tiene datos de imagen válidos.");
        return;
    }
    const predefinedFile = base64ToFile(imageBase64, `${name.replace(/\s/g, '_')}.jpg`);
    onImageUpload(predefinedFile);
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
          className={`w-full max-w-2xl h-auto min-h-[20rem] border-4 border-dashed rounded-3xl flex flex-col justify-center items-center text-center p-4 sm:p-8 transition-all duration-300 ${dragActive ? 'border-primary-accent bg-pink-50' : 'border-secondary-accent/50 bg-white'}`}
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          aria-label="Área para subir la foto de tu espacio"
        >
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} aria-label="Seleccionar archivo de imagen"/>
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleChange} aria-label="Tomar foto con la cámara"/>
          <p className="text-text-color-soft mb-4 text-lg">Arrastra aquí la foto de tu rincón especial</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button type="button" onClick={() => onButtonClick(fileInputRef)} className="px-8 py-3 btn-primary" aria-label="Seleccionar archivo desde el sistema">
                Elige una Foto
              </button>
              <button type="button" onClick={() => onButtonClick(cameraInputRef)} className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gray-200 text-text-color font-semibold shadow-lg hover:scale-105 transition-transform" aria-label="Usar la cámara para tomar una foto">
                <CameraIcon className="w-6 h-6"/>
                Usa la Cámara
              </button>
          </div>
          {/* Aspect Ratio Selector */}
          <div className="mt-4 w-full max-w-xs">
              <label htmlFor="aspect-ratio-select" className="block text-sm font-medium text-text-color-soft mb-2">
                  Relación de Aspecto para el Diseño:
              </label>
              <select
                  id="aspect-ratio-select"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as '1:1' | '3:4' | '4:3' | '9:16' | '16:9')}
                  className="w-full p-2 border border-secondary-accent/50 rounded-lg bg-gray-50 text-text-color focus:ring-2 focus:ring-primary-accent transition"
                  aria-label="Seleccionar relación de aspecto de la imagen"
              >
                  <option value="1:1">1:1 (Cuadrado)</option>
                  <option value="4:3">4:3 (Horizontal)</option>
                  <option value="3:4">3:4 (Vertical)</option>
                  <option value="16:9">16:9 (Panorámica)</option>
                  <option value="9:16">9:16 (Retrato)</option>
              </select>
          </div>
          {/* New "Regenerar" button to imply starting fresh */}
          <button type="button" onClick={() => onButtonClick(fileInputRef)} className="mt-8 px-8 py-3 btn-primary" aria-label="Generar nuevas ideas para tu espacio">
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
                          tabIndex={0}
                          aria-label={`Ver la inspiración: ${project.name}`}
                      >
                          <ImageWithFallback 
                              src={project.originalImage} // project.originalImage can be string | null
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

      {/* NEW SECTION: Elige tu Estilo de Rosi */}
      {inspirationStyleImages.length > 0 && (
          <div className="w-full mt-16">
              <h3 className="text-3xl sm:text-4xl main-title title-gradient text-center mb-6">Empieza con la Inspiración de Rosi</h3>
              <p className="text-text-color-soft text-center mb-8">
                  ¿No tienes una foto a mano? Elige una de estas inspiraciones predefinidas para que tu universo de sueños haga su magia y cree un nuevo proyecto para ti.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {inspirationStyleImages.map(inspiration => (
                      <button
                          key={inspiration.id}
                          onClick={() => handleSelectPredefinedImage(inspiration.image, inspiration.name)}
                          className="gradient-card rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 cursor-pointer text-left"
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