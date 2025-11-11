export interface Furniture {
  name: string;
  description: string;
  price: string;
  link: string;
  imageUrl?: string; // New: Optional URL for the furniture image
}

export interface ImageBase64 {
  data: string | null;
  mimeType: string;
}

export interface Iteration {
    prompt: string;
    imageUrl: string | null;
    imageBase64: ImageBase64 | null; // Can be null for archived projects
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
  imageBase64: ImageBase64 | null; // Can be null for archived projects
  iterations: Iteration[];
  comments: Comment[]; // Added comments to StyleVariation
}

export interface Project {
  id: string;
  name: string;
  originalImage: string | null; // This will now store the full data: URL for persistence
  originalImageBase64: ImageBase64 | null; // Can be null for archived projects
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
  groundingUrls?: GroundingUrl[]; // Array of objects
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}