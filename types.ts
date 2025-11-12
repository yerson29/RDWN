export interface Furniture {
  name: string;
  description: string;
  price: string;
  link: string;
  imageUrl?: string; 
}

export interface ImageBase64 {
  data: string | null;
  mimeType: string;
}

export interface Iteration {
    prompt: string;
    imageUrl: string | null;
    imageBase64: ImageBase64 | null; 
    description?: string;
    color_palette?: string[];
    furniture_recommendations?: Furniture[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export interface StyleVariation {
  style_name: string;
  description: string;
  color_palette: string[];
  furniture_recommendations: Furniture[];
  imageUrl: string | null;
  imageBase64: ImageBase64 | null; 
  iterations: Iteration[];
  comments: Comment[]; 
}

export interface Project {
  id: string;
  name: string;
  originalImage: string | null; 
  originalImageBase64: ImageBase64 | null; 
  analysis: string;
  styleVariations: StyleVariation[];
  createdAt: string;
}

export interface FavoriteDesign {
  id: string;
  projectId: string;
  projectName: string;
  favoritedAt: string;
  styleVariation: StyleVariation;
}

export type AppView = 'upload' | 'project' | 'archive' | 'favorites' | 'diary';

export const ALL_STYLES = ['Moderno', 'Nórdico', 'Clásico', 'Bohemio', 'Industrial', 'Rústico'];

// --- Chatbot Types for Search Grounding ---
export interface GroundingUrl {
  uri: string;
  title: string;
}

export interface ChatMessagePart {
  text?: string;
  groundingUrls?: GroundingUrl[]; 
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}