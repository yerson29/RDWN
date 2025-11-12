import { Project, StyleVariation, FavoriteDesign, ImageBase64, Furniture } from './types';

// Helper to clamp a number between min and max
function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}

// General function to adjust color lightness/darkness
function adjustColorByPercentage(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;

    // Parse R, G, B components
    let r = parseInt(cleanHex.substring(0, 2), 16);
    let g = parseInt(cleanHex.substring(2, 4), 16);
    let b = parseInt(cleanHex.substring(4, 6), 16);

    const adjustChannel = (channel: number) => {
        const adjusted = Math.round(channel * (1 + percent / 100));
        return clamp(adjusted, 0, 255);
    };

    r = adjustChannel(r);
    g = adjustChannel(g);
    b = adjustChannel(b);

    // Convert back to hex
    const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const REFLECTIVE_PHRASES = [
    "La inspiración es un susurro del alma que transforma los espacios.",
    "Cada rincón de tu hogar, un lienzo esperando tu visión.",
    "El diseño no es solo cómo se ve, sino cómo te hace sentir.",
    "Un espacio transformado es un espíritu renovado.",
    "Descubre la belleza en la armonía de tus elecciones.",
    "Tu hogar es el santuario de tu alma, diséñalo con amor.",
    "La magia del diseño está en los detalles que cuentas.",
    "Deja que la creatividad fluya y transforme tu entorno.",
    "Un espacio bien diseñado es una conversación constante.",
    "Visualiza tus sueños y Rosi los hará realidad."
];

export const MOTIVATION_PHRASES = [
    "¡Tu creatividad brilla más que nunca! ✨",
    "¡Qué ojo tan increíble para el diseño! 💖",
    "Cada elección tuya es un paso hacia un espacio soñado. ¡Inspírate! 🌟",
    "¡Estás tejiendo magia en cada detalle! 🌈",
    "Tu buen gusto es la clave de estas joyas. ¡Sigue así! 💫",
    "El diseño es tu lenguaje, y lo hablas de maravilla. 🗣️",
    "¡Felicidades por crear algo tan hermoso! 🌺",
    "¡Tu espacio interior está cobrando vida! 🌱",
    "¡Eres una verdadera maga del diseño! 🎩",
    "Este diseño es un reflejo perfecto de tu esencia. 👑"
];

// Placeholder for initialSeedData
export const initialSeedData: { projects: Project[]; favorites: FavoriteDesign[] } = {
    projects: [],
    favorites: [],
};

// --- Imágenes de Inspiración y Tendencia (Base64) ---
// Usando SVG Base64 de colores sólidos para placeholders visuales
const PRIMARY_PINK_SVG_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjQzRjk0Ii8+PC9zdmc+'; // Color --color-primary-pink
const SECONDARY_PURPLE_SVG_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOUQ1NUZGIi8+PC9zdmc+'; // Color --color-secondary-purple
const SOFT_PURPLE_SVG_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOEU2RTlFIi8+PC9zdmc+'; // Color --color-soft-purple
const LIGHT_BG_SVG_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjlFQ0ZFIi8+PC9zdmc+'; // Color --color-light-bg

export const MODERN_ROOM_IMAGE: ImageBase64 = {
    data: LIGHT_BG_SVG_BASE64, // Usar un color claro para la imagen de sala moderna
    mimeType: 'image/svg+xml',
};

export const trendingDesignImages: { id: string; name: string; image: ImageBase64 }[] = [
    {
        id: 'trend-1',
        name: 'Serenidad Nórdica',
        image: {
            data: SOFT_PURPLE_SVG_BASE64, // Usar soft purple para este
            mimeType: 'image/svg+xml',
        },
    },
    {
        id: 'trend-2',
        name: 'Lujo Moderno',
        image: {
            data: SECONDARY_PURPLE_SVG_BASE64, // Usar secondary purple
            mimeType: 'image/svg+xml',
        },
    },
    {
        id: 'trend-3',
        name: 'Bohemio Chic',
        image: {
            data: PRIMARY_PINK_SVG_BASE64, // Usar primary pink
            mimeType: 'image/svg+xml',
        },
    },
    {
        id: 'trend-4',
        name: 'Clásico Renovado',
        image: {
            data: LIGHT_BG_SVG_BASE64, // Usar light background color
            mimeType: 'image/svg+xml',
        },
    },
];

export const inspirationStyleImages: { id: string; name: string; image: ImageBase64 }[] = [
    {
        id: 'insp-1',
        name: 'Estudio Minimalista',
        image: {
            data: PRIMARY_PINK_SVG_BASE64,
            mimeType: 'image/svg+xml',
        },
    },
    {
        id: 'insp-2',
        name: 'Cocina Industrial',
        image: {
            data: SECONDARY_PURPLE_SVG_BASE64,
            mimeType: 'image/svg+xml',
        },
    },
    {
        id: 'insp-3',
        name: 'Dormitorio Rústico',
        image: {
            data: SOFT_PURPLE_SVG_BASE64,
            mimeType: 'image/svg+xml',
        },
    },
    {
        id: 'insp-4',
        name: 'Sala Ecléctica',
        image: {
            data: LIGHT_BG_SVG_BASE64,
            mimeType: 'image/svg+xml',
        },
    },
];