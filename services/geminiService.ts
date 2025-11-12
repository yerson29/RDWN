import { GoogleGenAI, Type, Modality } from "@google/genai";
import { StyleVariation, Furniture, ImageBase64, ChatMessagePart, ChatMessage } from '../types';

// --- Model Constants ---
const imageGenerationModelName = 'imagen-4.0-generate-001'; 
const imageEditingModelName = 'gemini-2.5-flash-image'; 
const lowLatencyTextModelName = 'gemini-2.5-flash'; 
const complexTextModelName = 'gemini-2.5-pro'; 
const chatbotModelName = 'gemini-2.5-flash'; 

const MAX_IMAGE_GENERATION_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000; 

const handleApiError = (error: any, context: string): Error => {
    console.error(`Error en ${context}:`, error);
    let errorMessage = error.message || JSON.stringify(error);

    // Detectar específicamente el error de cuota excedida
    if (errorMessage.includes("You exceeded your current quota") || (error.code === 429 || error.status === 429)) {
        const quotaError = new Error(
            `QUOTA_EXCEEDED: Tu magia ha alcanzado su límite por ahora. ` +
            `Por favor, revisa tu plan y detalles de facturación en https://ai.google.dev/gemini-api/docs/rate-limits. ` +
            `Para monitorear tu uso actual, visita: https://ai.dev/usage?tab=rate-limit.`
        );
        (quotaError as any).code = 'QUOTA_EXCEEDED'; // Add a custom code for easier detection
        return quotaError;
    }
    
    // Si la API devuelve un error de bloqueo
    if (error.promptFeedback?.blockReason) {
        return new Error(`¡Uy, parece que la magia fue bloqueada en ${context}! Razón: ${error.promptFeedback.blockReason}. ¿Intentamos con otras palabras o una imagen diferente para que Rosi pueda seguir soñando?`);
    }

    // Detectar errores del servidor (5xx)
    if ((error.status >= 500 && error.status < 600) || errorMessage.includes("Internal Server Error")) {
        // Extraer el código de estado si está disponible
        const statusCode = error.status ? ` (${error.status})` : '';
        return new Error(
            `¡Un duendecillo travieso ha causado un fallo en el servidor${statusCode} en ${context}! ` +
            `No es culpa de tu magia. Por favor, dale unos minutos e inténtalo de nuevo. ` +
            `Si los duendecillos persisten, contacta a soporte.`
        );
    }

    // Errores genéricos
    return new Error(`¡Oh no! La magia se detuvo inesperadamente en ${context}: ${errorMessage}. Algo salió volando. Inténtalo de nuevo, por favor.`);
};


export const fileToGenerativePart = (data: string | null, mimeType: string) => {
  if (data === null) {
    return { text: '' }; 
  }
  return {
    inlineData: {
      data,
      mimeType
    },
  };
};

export const analyzeImageDetailed = async (base64Data: string, mimeType: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    try {
        const response = await ai.models.generateContent({
            model: complexTextModelName, 
            contents: { parts: [imagePart, { text: "Realiza un 'Análisis Poético del Espacio'. En una o dos frases concisas, captura el alma, la esencia y el potencial latente de esta habitación. Usa un lenguaje evocador, brillante y elegante que vaya más allá de lo obvio. Este análisis será la piedra angular para futuras transformaciones. Sé profundo, como un susurro que revela el verdadero espíritu del lugar." }] },
            config: {
                thinkingConfig: { thinkingBudget: 8192 }, 
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

export const regenerateAnalysis = async (base64Data: string | null, mimeType: string, userPrompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    try {
        const response = await ai.models.generateContent({
            model: complexTextModelName,
            contents: { parts: [imagePart, { text: `Basado en la imagen y la siguiente petición del usuario, genera un nuevo 'Análisis Poético del Espacio'. Sé evocador, brillante y elegante, capturando el alma del lugar desde una nueva perspectiva. Petición del usuario: "${userPrompt}"` }] },
            config: {
                thinkingConfig: { thinkingBudget: 8192 },
            },
        });
        if (response.promptFeedback?.blockReason) {
            throw response;
        }
        return response.text;
    } catch (err) {
        throw handleApiError(err, "regenerar análisis de la imagen");
    }
};

const generateStyleDetails = async (base64ImageData: string | null, mimeType: string, styleName: string, projectAnalysis: string): Promise<Omit<StyleVariation, 'imageUrl' | 'imageBase64' | 'iterations' | 'comments'>> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string }); 
    const imagePart = fileToGenerativePart(base64ImageData, mimeType);
    
    try {
        const response = await ai.models.generateContent({
            model: complexTextModelName, 
            contents: { parts: [
                imagePart, 
                {text: `El espacio original fue analizado poéticamente como: "${projectAnalysis}". Ahora, viendo esta imagen rediseñada en estilo ${styleName}, proporciona:
                1.  **Descripción:** En una o dos frases, describe cómo esta nueva imagen encarna el estilo ${styleName}, haciendo referencia directa a cómo transforma la esencia del espacio original (ej: "La serenidad del espacio original se transforma en una vibrante energía moderna...").
                2.  **Paleta de colores:** 5 colores en códigos hexadecimales.
                3.  **Recomendaciones de muebles:** 3 productos. Para cada uno: nombre, descripción breve, precio en CLP, un enlace DIRECTO y VÁLIDO a un producto en STOCK en una tienda de CHILE (Falabella, Sodimac, Ripley, Paris).
                4.  **imageUrl para muebles:** Es CRÍTICO que la URL sea funcional y sin restricciones de CORS. Si no estás 100% seguro, DEBES usar este placeholder: "https://via.placeholder.com/200/F9ECFE/4C1D6E?text=Mueble". NO inventes URLs.`}
            ] },
            config: {
                responseMimeType: "application/json",
                thinkingConfig: { thinkingBudget: 32768 }, 
            },
        });

        if (response.promptFeedback?.blockReason) {
            throw response; 
        }

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("La respuesta de la IA llegó vacía para los detalles del estilo. ¡Parece que la magia se tomó un descanso! Intentemos de nuevo.");
        }

        let parsed;
        try {
            parsed = JSON.parse(jsonText);
        } catch (e: any) {
            console.error("Failed to parse JSON response for style details:", e, "Raw response text:", jsonText);
            throw new Error(`¡Uy! La IA me dio una respuesta extraña que no entiendo para los detalles del estilo. Parece que un duendecillo desordenó los códigos. Detalle: ${e.message}.`);
        }
        
        if (!parsed || !parsed.description || !Array.isArray(parsed.color_palette) || !Array.isArray(parsed.furniture_recommendations)) {
            console.error("Parsed JSON for style details is missing expected properties. Parsed object:", parsed);
            throw new Error("El diseño llegó un poco desordenado. Algo no cuadra (faltan descripción, paleta de colores o muebles para este estilo). ¡Revisemos qué pasó!");
        }

        // Post-processing for furniture recommendations to ensure valid image URLs
        const defaultPlaceholder = "https://via.placeholder.com/200/FFD1DC/5A2C81?text=Mueble"; // Placeholder más tierno
        parsed.furniture_recommendations = parsed.furniture_recommendations.map((item: Furniture) => {
            let validImageUrl = item.imageUrl;
            // Basic validation: check if it starts with http/https or is a data URI
            if (!validImageUrl || (!validImageUrl.startsWith('http://') && !validImageUrl.startsWith('https://') && !validImageUrl.startsWith('data:'))) {
                console.warn(`Invalid or missing image URL for furniture item "${item.name}". Using placeholder.`);
                validImageUrl = defaultPlaceholder;
            }
            return { ...item, imageUrl: validImageUrl };
        });

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
    analysis: string,
    styleName: string, 
    aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
): Promise<ImageBase64> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string }); 

    const generationPrompt = `Basado en la esencia de una habitación descrita como "${analysis}", rediseña este espacio completamente en un estilo ${styleName}. Captura la atmósfera del análisis original pero transfórmala con muebles, colores, texturas y decoración coherentes con el estilo ${styleName}. El resultado debe ser una imagen fotorrealista de alta calidad, clara, sin personas y con una iluminación natural y atractiva.`;
    
    let delay = BASE_RETRY_DELAY_MS; 

    for (let i = 0; i < MAX_IMAGE_GENERATION_RETRIES; i++) {
        try {
            const response = await ai.models.generateImages({
                model: imageGenerationModelName, 
                prompt: generationPrompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg', 
                  aspectRatio: aspectRatio, 
                },
            });

            if (!response.generatedImages || response.generatedImages.length === 0) {
                if (i < MAX_IMAGE_GENERATION_RETRIES - 1) {
                    console.warn(`Reintento ${i + 1}/${MAX_IMAGE_GENERATION_RETRIES} para la generación de imagen (NO_GENERATED_IMAGES).`);
                    await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 500)); 
                    delay *= 2; 
                    continue;
                } else {
                    throw new Error("La IA no pudo crear la imagen esta vez. ¡Parece que los pinceles mágicos se quedaron sin pintura! No se encontraron candidatos de diseño.");
                }
            }
            
            const generatedImage = response.generatedImages[0].image;
            
            return {
                data: generatedImage.imageBytes,
                mimeType: 'image/jpeg', 
            };

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
    throw new Error("Lo intenté varias veces pero no pude crear la imagen. ¿Probamos con otra idea para tu espacio? ¡Quizás la musa está un poco tímida!");
};


export const generateSingleStyleVariation = async ( 
    analysis: string,
    styleName: string, 
    aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
): Promise<StyleVariation> => {
    const newImageData = await generateInitialStyledImage(analysis, styleName, aspectRatio);
    const details = await generateStyleDetails(newImageData.data, newImageData.mimeType, styleName, analysis);

    return {
        ...details,
        imageUrl: `data:${newImageData.mimeType};base64,${newImageData.data}`,
        imageBase64: newImageData,
        iterations: [],
        comments: [], 
    };
};

export async function generateInitialDesignsStream( 
    analysis: string, 
    styleName: string, 
    aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
): Promise<StyleVariation> { 
    try {
        const variation = await generateSingleStyleVariation(analysis, styleName, aspectRatio);
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
    styleName: string,
    projectAnalysis: string
): Promise<{ newImage: ImageBase64; newDetails: Pick<StyleVariation, 'description' | 'color_palette' | 'furniture_recommendations'> }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string }); 
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    const textPart = { text: `Refina esta imagen con el siguiente prompt: "${prompt}". Mantén la esencia del estilo ${styleName}.` };

    let refinedImage: ImageBase64 | null = null;
    let delay = BASE_RETRY_DELAY_MS; 

    for (let i = 0; i < MAX_IMAGE_GENERATION_RETRIES; i++) {
        try {
            const response = await ai.models.generateContent({
                model: imageEditingModelName, 
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            if (!response) {
                throw new Error("El refinamiento de imagen falló: La respuesta de la IA estaba vacía. ¡La magia se evaporó!");
            }

            if (response.promptFeedback?.blockReason) {
                throw response; 
            }

            const candidate = response.candidates?.[0];
            if (!candidate) {
                throw new Error("El refinamiento de imagen falló: No se encontró una idea válida para tu espacio en la respuesta. ¡Los sueños se tomaron un descanso!");
            }

            if (candidate.finishReason === 'NO_IMAGE') {
                if (i < MAX_IMAGE_GENERATION_RETRIES - 1) {
                    console.warn(`Reintento ${i + 1}/${MAX_IMAGE_GENERATION_RETRIES} para el refinamiento (NO_IMAGE).`);
                    await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 500)); 
                    delay *= 2; 
                    continue;
                } else {
                    throw new Error("La IA no pudo generar una imagen para el refinamiento. ¡Parece que el pincel mágico está rebelde! Intenta con una instrucción diferente o menos compleja.");
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
            
            throw new Error("La respuesta de la IA para el refinamiento no contenía datos de imagen. ¡Quizás se perdió en el camino!");
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
      throw new Error("El refinamiento de imagen falló después de múltiples reintentos. ¡Es como si los pixeles mágicos se escondieran!");
    }
    
    const newDetailsResult = await generateStyleDetails(refinedImage.data, refinedImage.mimeType, styleName, projectAnalysis); 

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
            model: complexTextModelName, 
            contents: { parts: [imagePart, { text: prompt }] },
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
        throw handleApiError(err, "generar el párrafo de la historia");
    }
};

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
            contents: { parts: [imagePart, { text: regenerationPrompt }] }, 
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
    history: ChatMessage[] 
): Promise<ChatMessagePart[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const chat = ai.chats.create({
        model: chatbotModelName, 
        history: history.map(msg => ({ 
            role: msg.role,
            parts: msg.parts.map(p => ({ text: p.text || '' })) 
        })),
        config: {
            temperature: 0.7,
            topK: 32,
            topP: 0.8,
            tools: [{googleSearch: {}}], 
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
        
        return responseParts; 
    } catch (err) {
        throw handleApiError(err, "conversación con el chatbot");
    }
};