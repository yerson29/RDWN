import { GoogleGenAI, Type, Modality } from "@google/genai";
import { StyleVariation, Furniture, ImageBase64, ChatMessagePart, ChatMessage } from '../types';

// --- Model Constants ---
const imageGenerationModelName = 'imagen-4.0-generate-001'; // For initial image generation from text prompt
const imageEditingModelName = 'gemini-2.5-flash-image'; // For image-to-image editing (refinement)
const lowLatencyTextModelName = 'gemini-2.5-flash'; // For quick image analysis
const complexTextModelName = 'gemini-2.5-pro'; // For complex tasks like generating details/stories with thinking mode
const chatbotModelName = 'gemini-2.5-flash'; // For the chatbot, now with search grounding

const MAX_IMAGE_GENERATION_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000; // 1 second

const handleApiError = (error: any, context: string): Error => {
    console.error(`Error en ${context}:`, error);
    let errorMessage = error.message || JSON.stringify(error);

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

    // Detectar errores del servidor (5xx)
    if ((error.status >= 500 && error.status < 600) || errorMessage.includes("Internal Server Error")) {
        // Extraer el código de estado si está disponible
        const statusCode = error.status ? ` (${error.status})` : '';
        return new Error(
            `Un hechizo misterioso ha fallado en el servidor${statusCode} en ${context}. ` +
            `Esto es ajeno a tu magia. Por favor, inténtalo de nuevo en unos minutos. ` +
            `Si el problema persiste, contacta a soporte.`
        );
    }

    // Errores genéricos
    return new Error(`La magia se detuvo inesperadamente en ${context}: ${errorMessage}.`);
};


export const fileToGenerativePart = (data: string | null, mimeType: string) => {
  if (data === null) {
    // This case should ideally not happen if ImageBase64.data is properly checked
    // before calling this function. However, to prevent runtime errors, return a placeholder.
    // In scenarios where an image is truly optional, the part itself might be optional.
    return { text: '' }; // Or throw an error depending on desired strictness
  }
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
            model: lowLatencyTextModelName, // Use flash for quick analysis
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

// Nueva función para un análisis más detallado de la imagen original
export const analyzeImageDetailed = async (base64Data: string, mimeType: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    try {
        const response = await ai.models.generateContent({
            model: complexTextModelName, // Use Pro for detailed analysis with thinking budget
            contents: { parts: [imagePart, { text: "Imagina que eres un crítico de diseño de interiores con una pluma mágica. Describe esta habitación con el máximo detalle posible, centrándote en su tipo, disposición, elementos arquitectónicos distintivos, tipo de muebles existentes, paleta de colores predominante, texturas, iluminación y el ambiente general que evoca. Sé increíblemente descriptivo, poético y objetivo a la vez, como si prepararas una base para un rediseño que genere una nueva imagen, intentando preservar la estructura básica y la esencia del espacio. Usa un lenguaje envolvente y rico en metáforas que haga soñar a quien lo lea." }] },
            config: {
                thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for Pro model
            },
        });
        if (response.promptFeedback?.blockReason) {
            throw response;
        }
        return response.text;
    } catch (err) {
        throw handleApiError(err, "obtener descripción detallada de la imagen");
    }
};

const generateStyleDetails = async (base64ImageData: string | null, mimeType: string, styleName: string): Promise<Omit<StyleVariation, 'imageUrl' | 'imageBase64' | 'iterations' | 'comments'>> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string }); 
    // Ensure base64ImageData is handled as null before calling fileToGenerativePart if needed,
    // although generateSingleStyleVariation should ensure it's a valid ImageBase64 object's data.
    const imagePart = fileToGenerativePart(base64ImageData, mimeType);
    
    try {
        const response = await ai.models.generateContent({
            model: complexTextModelName, // Use Pro for complex task with thinking budget
            contents: { parts: [imagePart, {text: `Basado en esta imagen de una habitación rediseñada en estilo ${styleName}, proporciona una breve descripción, una paleta de 5 colores en códigos hexadecimales y 3 recomendaciones de muebles. Para cada mueble, incluye: nombre, una breve descripción, su precio en pesos chilenos (CLP), un enlace DIRECTO y VÁLIDO a un producto que esté ACTUALMENTE DISPONIBLE y EN STOCK en una tienda online de CHILE (ej. Falabella, Sodimac, Ripley, Paris). Es CRÍTICO que verifiques que la URL es funcional y de acceso público. Si NO puedes encontrar una URL de imagen de producto VERDADERAMENTE PÚBLICA y FUNCIONAL para la tienda específica, o si tienes la MENOR duda sobre su validez, DEBES usar el siguiente placeholder universal: "https://via.placeholder.com/150/F43F94/FFFFFF?text=Mueble". NO inventes URLs ni uses enlaces a páginas web que no sean la imagen directa.`}] },
            config: {
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for Pro model
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
                                    imageUrl: { type: Type.STRING, description: 'URL de la imagen PÚBLICA y FUNCIONAL del mueble (ej. terminada en .jpg o .png). Prioriza una URL funcional y representativa del producto, o un placeholder si no hay una imagen válida.' }
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
        };
    } catch (err) {
        throw handleApiError(err, `crear detalles del estilo ${styleName}`);
    }
};

export const generateInitialStyledImage = async (
    originalBase64Data: string, 
    originalMimeType: string, 
    styleName: string, 
    aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
): Promise<ImageBase64> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string }); 

    // Paso 1: Obtener una descripción detallada de la imagen original
    // NOTE: analyzeImageDetailed se llamará una vez en App.tsx y se pasará como `project.analysis`
    // Aquí, se usa un prompt genérico para la imagen a generar, asumiendo que el análisis detallado
    // ya se hizo y se usará para contexto si es necesario en una capa superior.
    const generationPrompt = `Genera una imagen fotorrealista de una habitación. Ahora, rediseña esta habitación completamente para que luzca en un estilo ${styleName}. Incluye muebles, colores, texturas y decoración que sean coherentes con el estilo ${styleName}. El resultado debe ser una imagen de alta calidad, clara, sin personas y con una iluminación natural y atractiva.`;
    
    let delay = BASE_RETRY_DELAY_MS; 

    for (let i = 0; i < MAX_IMAGE_GENERATION_RETRIES; i++) {
        try {
            // Usar ai.models.generateImages con imagen-4.0-generate-001 para generar la imagen
            const response = await ai.models.generateImages({
                model: imageGenerationModelName, // imagen-4.0-generate-001
                prompt: generationPrompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg', // Standard output mime type
                  aspectRatio: aspectRatio, // Apply the selected aspect ratio
                },
            });

            // No existe 'promptFeedback' en GenerateImagesResponse. La lógica de reintento y error
            // se basa en si se generaron imágenes o si la API lanza un error.
            if (!response.generatedImages || response.generatedImages.length === 0) {
                if (i < MAX_IMAGE_GENERATION_RETRIES - 1) {
                    console.warn(`Reintento ${i + 1}/${MAX_IMAGE_GENERATION_RETRIES} para la generación de imagen (NO_GENERATED_IMAGES).`);
                    await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 500)); 
                    delay *= 2; 
                    continue;
                } else {
                    throw new Error("Mi universo de sueños no pudo crear la imagen esta vez. No se encontraron candidatos de diseño.");
                }
            }
            
            const generatedImage = response.generatedImages[0].image;
            
            return {
                data: generatedImage.imageBytes,
                mimeType: 'image/jpeg', // The model always returns jpeg for outputMimeType 'image/jpeg'
            };

        } catch (error: any) {
            if (error.message && error.message.startsWith("QUOTA_EXCEEDED:")) {
                throw error; // Re-throw quota errors immediately
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


export const generateSingleStyleVariation = async ( // Renamed from generateFullVariation
    base64Data: string, 
    mimeType: string, 
    styleName: string, 
    aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
): Promise<StyleVariation> => {
    // Pass aspectRatio to generateInitialStyledImage, though it's not directly used in its config
    const newImageData = await generateInitialStyledImage(base64Data, mimeType, styleName, aspectRatio);
    // FIX: Corrected the call to generateStyleDetails to pass 3 arguments instead of 4.
    const details = await generateStyleDetails(newImageData.data, newImageData.mimeType, styleName);

    return {
        ...details,
        imageUrl: `data:${newImageData.mimeType};base64,${newImageData.data}`,
        imageBase64: newImageData,
        iterations: [],
        comments: [], // Initialize comments array
    };
};

// Modificada para generar un estilo individual a la vez
export async function generateInitialDesignsStream( // Keep name for consistency, but behavior changed
    base64Data: string, 
    mimeType: string, 
    styleName: string, // Now takes a specific styleName
    aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
): Promise<StyleVariation> { // Now returns a single StyleVariation
    try {
        const variation = await generateSingleStyleVariation(base64Data, mimeType, styleName, aspectRatio);
        return variation;
    } catch (error) {
        console.error(`Falló la generación de la variación para el estilo: ${styleName}`, error);
        throw handleApiError(error, `generar estilo inicial ${styleName}`);
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
                model: imageEditingModelName, // Use gemini-2.5-flash-image for editing
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
    
    // FIX: Corrected the call to generateStyleDetails to pass 3 arguments instead of 4.
    const newDetailsResult = await generateStyleDetails(refinedImage.data, refinedImage.mimeType, styleName); // Uses Pro model with thinking config

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
    projectAnalysis: string
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const imagePart = fileToGenerativePart(imageBase64.data, imageBase64.mimeType);

    const prompt = `Imagina una historia ambientada en esta habitación, diseñada en estilo ${styleName}. Considerando que esta es ${projectAnalysis.toLowerCase()}, describe el ambiente y la escena, y escribe un párrafo inicial a una historia que comience aquí. Sé creativo, sugerente y envolvente. NO añadas títulos, ni nombres de personajes, ni diálogos, solo la descripción del inicio de una historia.`;
    try {
        const response = await ai.models.generateContent({
            model: complexTextModelName, // Use Pro model for story generation
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                temperature: 0.9,
                topK: 64,
                topP: 0.95,
                thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for Pro model
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

// Se corrige regenerateStoryParagraph para usar ai.models.generateContent con el historial de chat y la imagen
// de manera multimodal, ya que chat.sendMessage no soporta 'contents' directamente.
export const regenerateStoryParagraph = async (
    chatHistory: { role: string; parts: { text: string }[] }[],
    imageBase64: ImageBase64,
    styleName: string,
    projectAnalysis: string
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const imagePart = fileToGenerativePart(imageBase64.data, imageBase64.mimeType);

    const initialContext = `El usuario quiere generar un párrafo inicial para una historia ambientada en esta habitación. La habitación está diseñada en estilo ${styleName}, y su análisis general es: ${projectAnalysis.toLowerCase()}. Basado en la imagen y el estilo, el modelo debe escribir un párrafo de apertura que analice el ambiente y la escena. NO añadas títulos, ni nombres de personajes, ni diálogos, solo la descripción del inicio de una historia. El usuario ahora está dando feedback para regenerar el párrafo.`;

    // Aplanar el historial de chat en un solo prompt de texto
    const conversationText = chatHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Model'}: ${msg.parts.map(p => p.text).join('')}`).join('\n');
    
    // Combinar el contexto inicial, el historial de conversación y la solicitud de regeneración explícita
    const regenerationPrompt = `${initialContext}\n\nHistorial de conversación:\n${conversationText}\n\nPor favor, regenera el párrafo inicial de la historia teniendo en cuenta esta retroalimentación.`;

    try {
        const response = await ai.models.generateContent({
            model: complexTextModelName,
            contents: { parts: [imagePart, { text: regenerationPrompt }] }, // Entrada multimodal para generateContent
            config: {
                temperature: 0.9,
                topK: 64,
                topP: 0.95,
                thinkingConfig: { thinkingBudget: 32768 },
            },
        });
        if (response.promptFeedback?.blockReason) {
            throw response;
        }
        return response.text;
    } catch (err) {
        throw handleApiError(err, "regenerar el párrafo de la historia");
    }
};

export const chatWithGemini = async (
    history: ChatMessage[] // Use new ChatMessage type
): Promise<ChatMessagePart[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const chat = ai.chats.create({
        model: chatbotModelName, // Use gemini-2.5-flash for general chatbot and search grounding
        history: history.map(msg => ({ // Map history to match model's expected format
            role: msg.role,
            parts: msg.parts.map(p => ({ text: p.text || '' })) // Only pass text for history, as groundingUrls are for output
        })),
        config: {
            temperature: 0.7,
            topK: 32,
            topP: 0.8,
            tools: [{googleSearch: {}}], // Add Google Search grounding tool
        },
    });

    try {
        const userMessageText = history[history.length - 1].parts[0].text || '';
        const response = await chat.sendMessage({ message: userMessageText });
        
        if (response.promptFeedback?.blockReason) {
            throw response;
        }

        const responseParts: ChatMessagePart[] = [];
        responseParts.push({ text: response.text });

        // Extraer y añadir las URLs de grounding si están presentes
        // Se corrige el acceso a groundingMetadata que debe estar en el primer candidato.
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            const groundingUrls = [];
            for (const chunk of response.candidates[0].groundingMetadata.groundingChunks) {
                if (chunk.web?.uri && chunk.web.title) {
                    groundingUrls.push({ uri: chunk.web.uri, title: chunk.web.title });
                }
            }
            if (groundingUrls.length > 0) {
                responseParts.push({ groundingUrls: groundingUrls });
            }
        }
        
        return responseParts; // Return an array of ChatMessagePart
    } catch (err) {
        throw handleApiError(err, "conversación con el chatbot");
    }
};