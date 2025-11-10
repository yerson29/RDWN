import { GoogleGenAI, Type, Modality } from "@google/genai";
import { StyleVariation, Furniture, ImageBase64 } from '../types';

const MAX_IMAGE_GENERATION_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000; // 1 second

const imageModel = 'gemini-2.5-flash-image';
const textModel = 'gemini-2.5-flash';

const handleApiError = (error: any, context: string): Error => {
    console.error(`Error en ${context}:`, error);
    const errorMessage = error.message || JSON.stringify(error);

    // Detectar específicamente el error de cuota excedida
    if (errorMessage.includes("You exceeded your current quota") || (error.code === 429 || error.status === 429)) {
        return new Error(
            `QUOTA_EXCEEDED: Tu universo de sueños ha alcanzado su límite de magia por ahora. ` +
            `Por favor, revisa tu plan y detalles de facturación en https://ai.google.dev/gemini-api/docs/rate-limits. ` +
            `Para monitorear tu uso actual, visita: https://ai.dev/usage?tab=rate-limit.`
        );
    }
    
    // Si la API devuelve un error de bloqueo
    if (error.promptFeedback?.blockReason) {
        return new Error(`La magia fue bloqueada en ${context}. Razón: ${error.promptFeedback.blockReason}. Por favor, ¿intentamos con otras palabras o una imagen diferente?`);
    }

    // Errores genéricos
    return new Error(`La magia se detuvo inesperadamente en ${context}: ${errorMessage}.`);
};


export const fileToGenerativePart = (data: string, mimeType: string) => {
  return {
    inlineData: {
      data,
      mimeType
    },
  };
};

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string }); 
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: { parts: [imagePart, { text: "Analiza esta imagen de una habitación. Describe el tipo de habitación (ej. sala de estar, dormitorio) y su estilo actual. Sé conciso y directo." }] },
        });
        if (response.promptFeedback?.blockReason) {
            throw response; 
        }
        return response.text;
    } catch (err) {
        throw handleApiError(err, "analizar la imagen");
    }
};

const generateStyleDetails = async (base64ImageData: string, mimeType: string, styleName: string): Promise<Omit<StyleVariation, 'imageUrl' | 'imageBase64' | 'iterations'>> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string }); 
    const imagePart = fileToGenerativePart(base64ImageData, mimeType);
    
    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: { parts: [imagePart, {text: `Basado en esta imagen de una habitación rediseñada en estilo ${styleName}, proporciona una breve descripción, una paleta de 5 colores en códigos hexadecimales y 3 recomendaciones de muebles. Para cada mueble, incluye: nombre, una breve descripción, su precio en pesos chilenos (CLP), un enlace DIRECTO y VÁLIDO a un producto que esté ACTUALMENTE DISPONIBLE y EN STOCK en una tienda online de CHILE (ej. Falabella, Sodimac, Ripley, Paris). ES OBLIGATORIO QUE VERIFIQUES LA DISPONIBILIDAD. Además, proporciona una URL de imagen PÚBLICA y FUNCIONAL que apunte directamente al archivo de imagen del producto (que termine en .jpg, .png, .webp). LA URL DE LA IMAGEN DEBE SER DIRECTA AL ARCHIVO, NO A UNA PÁGINA WEB. Prioriza imágenes de la misma tienda online. Si no encuentras una URL de imagen de producto válida, busca una imagen genérica de alta calidad de un producto muy similar que sea funcional.`}] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING, description: 'Una breve descripción del estilo de la habitación.' },
                        color_palette: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'Una matriz de 5 códigos de color hexadecimales que representan la paleta de colores.'
                        },
                        furniture_recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    price: { type: Type.STRING, description: 'Precio en pesos chilenos con símbolo, ej. CLP$199.990' },
                                    link: { type: Type.STRING, description: 'Un enlace DIRECTO a un producto DISPONIBLE y EN STOCK en una tienda online de CHILE (ej. Falabella, Sodimac, Ripley, Paris).' },
                                    imageUrl: { type: Type.STRING, description: 'URL de la imagen PÚBLICA y FUNCIONAL del mueble (ej. terminada en .jpg o .png). Prioriza una URL funcional y representativa del producto.' }
                                },
                                 required: ['name', 'description', 'price', 'link', 'imageUrl']
                            }
                        }
                    },
                    required: ['description', 'color_palette', 'furniture_recommendations']
                }
            }
        });

        if (response.promptFeedback?.blockReason) {
            throw response; 
        }

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("La respuesta de mi universo de sueños llegó vacía para los detalles del estilo. Intentemos de nuevo.");
        }

        let parsed;
        try {
            parsed = JSON.parse(jsonText);
        } catch (e: any) {
            console.error("Failed to parse JSON response for style details:", e, "Raw response text:", jsonText);
            throw new Error(`Mi universo de sueños te dio una respuesta extraña que no entiendo para los detalles del estilo. Detalle: ${e.message}.`);
        }
        
        if (!parsed || !parsed.description || !Array.isArray(parsed.color_palette) || !Array.isArray(parsed.furniture_recommendations)) {
            console.error("Parsed JSON for style details is missing expected properties. Parsed object:", parsed);
            throw new Error("El diseño llegó un poco desordenado. Algo no cuadra (faltan descripción, paleta de colores o muebles para este estilo).");
        }

        return {
            style_name: styleName,
            description: parsed.description,
            color_palette: parsed.color_palette,
            furniture_recommendations: parsed.furniture_recommendations,
            comments: [],
        };
    } catch (err) {
        throw handleApiError(err, `crear detalles del estilo ${styleName}`);
    }
};

export const generateStyledImage = async (base64Data: string, mimeType: string, styleName: string): Promise<ImageBase64> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string }); 
    const prompt = `Rediseña esta habitación en un estilo ${styleName}. Mantén la estructura y disposición de la habitación pero cambia los muebles, colores y decoración para que coincida con el estilo ${styleName}. El resultado debe ser fotorrealista, de alta calidad y claro. No incluyas personas en la imagen.`;
    
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    const textPart = { text: prompt };

    let delay = BASE_RETRY_DELAY_MS; 

    for (let i = 0; i < MAX_IMAGE_GENERATION_RETRIES; i++) {
        try {
            const response = await ai.models.generateContent({
                model: imageModel,
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            if (!response) {
                throw new Error("Mi universo de sueños falló al generar la imagen: La respuesta llegó vacía.");
            }

            if (response.promptFeedback?.blockReason) {
                throw response; 
            }

            const candidate = response.candidates?.[0];
            if (!candidate) {
                throw new Error("Mi universo de sueños no encontró una idea válida para ti. ¿Intentamos de nuevo?");
            }
            
            if (candidate.finishReason === 'NO_IMAGE') {
                if (i < MAX_IMAGE_GENERATION_RETRIES - 1) {
                    console.warn(`Reintento ${i + 1}/${MAX_IMAGE_GENERATION_RETRIES} para la generación de imagen (NO_IMAGE).`);
                    await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 500)); 
                    delay *= 2; 
                    continue;
                } else {
                    throw new Error("Mi universo de sueños no pudo crear la imagen esta vez. Esto puede pasar si la idea es muy compleja o el contenido no es adecuado.");
                }
            }
            
            for (const part of candidate.content?.parts || []) {
                if (part.inlineData) {
                    return {
                        data: part.inlineData.data,
                        mimeType: part.inlineData.mimeType,
                    };
                }
            }
            throw new Error("La respuesta de mi universo de sueños no contenía los datos de la imagen. Esto puede indicar un problema en la generación.");

        } catch (error: any) {
            if (error.message && error.message.startsWith("QUOTA_EXCEEDED:")) {
                throw error; 
            }
            if (i < MAX_IMAGE_GENERATION_RETRIES - 1) {
                console.warn(`Reintento ${i + 1}/${MAX_IMAGE_GENERATION_RETRIES} para generación de imagen debido a error: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 500)); 
                delay *= 2; 
                continue;
            }
            throw handleApiError(error, `generar imagen estilizada de ${styleName}`);
        }
    }
    throw new Error("Lo intenté varias veces pero no pude crear la imagen. ¿Probamos con otra idea para tu espacio?");
};

const generateFullVariation = async (base64Data: string, mimeType: string, styleName: string): Promise<StyleVariation> => {
    const newImageData = await generateStyledImage(base64Data, mimeType, styleName);
    const details = await generateStyleDetails(newImageData.data, newImageData.mimeType, styleName);

    return {
        ...details,
        imageUrl: `data:${newImageData.mimeType};base64,${newImageData.data}`,
        imageBase64: newImageData,
        iterations: [],
    };
};

export async function* generateInitialDesignsStream(
    base64Data: string, 
    mimeType: string, 
): AsyncGenerator<StyleVariation> {
    const styles = ['Moderno', 'Nórdico', 'Clásico', 'Bohemio', 'Industrial', 'Rústico'];
    
    for (const style of styles) {
        try {
            const variation = await generateFullVariation(base64Data, mimeType, style);
            yield variation;
        } catch (error) {
            console.error(`Falló la generación de la variación para el estilo: ${style}`, error);
            throw handleApiError(error, `generar estilo inicial ${style}`);
        }
    }
};


export const refineDesign = async (
    base64Data: string, 
    mimeType: string, 
    prompt: string,
    styleName: string
): Promise<{ newImage: ImageBase64; newDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'> }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string }); 
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    const textPart = { text: prompt };

    let refinedImage: ImageBase64 | null = null;
    let delay = BASE_RETRY_DELAY_MS; 

    for (let i = 0; i < MAX_IMAGE_GENERATION_RETRIES; i++) {
        try {
            const response = await ai.models.generateContent({
                model: imageModel,
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            if (!response) {
                throw new Error("El refinamiento de imagen falló: La respuesta de mi universo de sueños estaba vacía.");
            }

            if (response.promptFeedback?.blockReason) {
                throw response; 
            }

            const candidate = response.candidates?.[0];
            if (!candidate) {
                throw new Error("El refinamiento de imagen falló: No se encontró una idea válida para tu espacio en la respuesta.");
            }

            if (candidate.finishReason === 'NO_IMAGE') {
                if (i < MAX_IMAGE_GENERATION_RETRIES - 1) {
                    console.warn(`Reintento ${i + 1}/${MAX_IMAGE_GENERATION_RETRIES} para el refinamiento (NO_IMAGE).`);
                    await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 500)); 
                    delay *= 2; 
                    continue;
                } else {
                    throw new Error("Mi universo de sueños no pudo generar una imagen para el refinamiento. Intenta con una instrucción diferente o menos compleja.");
                }
            }

            for (const part of candidate.content?.parts || []) {
                if (part.inlineData) {
                    refinedImage = {
                        data: part.inlineData.data,
                        mimeType: part.inlineData.mimeType,
                    };
                    break;
                }
            }
            
            if (refinedImage) break;
            
            throw new Error("La respuesta de mi universo de sueños para el refinamiento no contenía datos de imagen.");
        } catch (error: any) {
            if (error.message && error.message.startsWith("QUOTA_EXCEEDED:")) {
                throw error; 
            }
            if (i < MAX_IMAGE_GENERATION_RETRIES - 1) {
                console.warn(`Reintento ${i + 1}/${MAX_IMAGE_GENERATION_RETRIES} para refinamiento debido a error: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 500)); 
                delay *= 2; 
                continue;
            }
            throw handleApiError(error, `refinar el diseño del estilo ${styleName}`);
        }
    }
    
    if (!refinedImage) {
      throw new Error("El refinamiento de imagen falló después de múltiples reintentos.");
    }
    
    const newDetailsResult = await generateStyleDetails(refinedImage.data, refinedImage.mimeType, styleName);

    return {
        newImage: refinedImage,
        newDetails: {
            description: newDetailsResult.description,
            color_palette: newDetailsResult.color_palette,
            furniture_recommendations: newDetailsResult.furniture_recommendations,
        },
    };
};

export const generateStoryParagraph = async (
    imageBase64: ImageBase64,
    styleName: string,
    projectAnalysis: string,
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const imagePart = fileToGenerativePart(imageBase64.data, imageBase64.mimeType);

    const prompt = `Imagina una historia ambientada en esta habitación, diseñada en estilo ${styleName}. Considerando que esta es ${projectAnalysis.toLowerCase()}, describe el ambiente y la escena, y escribe un párrafo inicial a una historia que comience aquí. Sé creativo, sugerente y envolvente. NO añadas títulos, ni nombres de personajes, ni diálogos, solo la descripción del inicio de una historia.`
    try {
        const response = await ai.models.generateContent({
            model: textModel,
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                temperature: 0.9,
                topK: 64,
                topP: 0.95,
            },
        });
        if (response.promptFeedback?.blockReason) {
            throw response;
        }
        return response.text;
    } catch (err) {
        throw handleApiError(err, "generar el párrafo de la historia");
    }
};

export const regenerateStoryParagraph = async (
    chatHistory: { role: string; parts: { text: string }[] }[],
    imageBase64: ImageBase64,
    styleName: string,
    projectAnalysis: string,
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const imagePart = fileToGenerativePart(imageBase64.data, imageBase64.mimeType);

    // Contextualize the chat with the image and project details
    const initialContext = `El usuario quiere generar un párrafo inicial para una historia ambientada en esta habitación. La habitación está diseñada en estilo ${styleName}, y su análisis general es: ${projectAnalysis.toLowerCase()}. Basado en la imagen y el estilo, el modelo debe escribir un párrafo de apertura que analice el ambiente y la escena. NO añadas títulos, ni nombres de personajes, ni diálogos, solo la descripción del inicio de una historia. El usuario ahora está dando feedback para regenerar el párrafo.`;

    // Add the initial context as the first message from the user to prime the chat
    const fullChatHistory = [
        { role: 'user', parts: [{ text: initialContext }] },
        ...chatHistory
    ];
    
    const chat = ai.chats.create({
      model: textModel, // Asegúrate de que el modelo esté definido aquí
      history: fullChatHistory,
    });

    try {
        // Send the latest message (user's feedback) and get a new response
        const response = await chat.sendMessage({ parts: [imagePart, { text: fullChatHistory[fullChatHistory.length -1].parts[0].text}] }); 
        if (response.promptFeedback?.blockReason) {
            throw response;
        }
        return response.text;
    } catch (err) {
        throw handleApiError(err, "regenerar el párrafo de la historia");
    }
};