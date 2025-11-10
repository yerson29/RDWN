import { Project, StyleVariation, FavoriteDesign, ImageBase64, Furniture } from './types';

// Helper to clamp a number between min and max
function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}

// General function to adjust color lightness/darkness
function adjustColorByPercentage(hex: string, percent: number): string {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    const factor = percent / 100;

    r = clamp(Math.round(r + (r * factor)), 0, 255);
    g = clamp(Math.round(g + (g * factor)), 0, 255);
    b = clamp(Math.round(b + (b * factor)), 0, 255);

    const toHex = (c: number): string => c.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lightenColor(hex: string, percent: number): string {
    return adjustColorByPercentage(hex, Math.abs(percent));
}

function darkenColor(hex: string, percent: number): string {
    return adjustColorByPercentage(hex, -Math.abs(percent));
}

// --- Placeholder Base64 Images ---
// These are dummy Base64 strings for various room images and their styled variations.
// They are syntactically valid but represent placeholder visual content.
// In a real application, these would be high-quality, actual images.

const DUMMY_BASE64_IMAGE_JPG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGD4DwDIgBDs8yO2sAAAAABJRU5ErkJggg=='; // A 1x1 transparent PNG
const DUMMY_MIME_TYPE_PNG = 'image/png';
const DUMMY_MIME_TYPE_JPG = 'image/jpeg';


// --- Original Room Images ---
const baseLivingRoom: ImageBase64 = { 
    data: DUMMY_BASE64_IMAGE_JPG, // Usar la imagen dummy real
    mimeType: DUMMY_MIME_TYPE_JPG // Especificar el tipo MIME
};

const baseBedroom: ImageBase64 = { 
    data: DUMMY_BASE64_IMAGE_JPG, 
    mimeType: DUMMY_MIME_TYPE_JPG 
};

// --- Styled Variation Images (Base64) ---
// These would be actual styled images from the AI model in a real app.
const modernLivingRoom: ImageBase64 = { 
    data: DUMMY_BASE64_IMAGE_JPG, 
    mimeType: DUMMY_MIME_TYPE_JPG 
};
const nordicLivingRoom: ImageBase64 = { 
    data: DUMMY_BASE64_IMAGE_JPG, 
    mimeType: DUMMY_MIME_TYPE_JPG 
};
const classicLivingRoom: ImageBase64 = { 
    data: DUMMY_BASE64_IMAGE_JPG, 
    mimeType: DUMMY_MIME_TYPE_JPG 
};
const bohemianLivingRoom: ImageBase64 = { 
    data: DUMMY_BASE64_IMAGE_JPG, 
    mimeType: DUMMY_MIME_TYPE_JPG 
};
const industrialLivingRoom: ImageBase64 = { 
    data: DUMMY_BASE64_IMAGE_JPG, 
    mimeType: DUMMY_MIME_TYPE_JPG 
};
const rusticLivingRoom: ImageBase64 = { 
    data: DUMMY_BASE64_IMAGE_JPG, 
    mimeType: DUMMY_MIME_TYPE_JPG 
};

// --- Furniture Examples ---
const modernSofa: Furniture = {
    name: "Sofá Modular Moderno",
    description: "Sofá seccional de diseño minimalista en tono gris claro.",
    price: "CLP$599.990",
    link: "https://example.com/modern-sofa",
    imageUrl: "https://falabella.scene7.com/is/image/Falabella/88267277_1?wid=800&hei=800&qlt=70"
};

const nordicCoffeeTable: Furniture = {
    name: "Mesa de Centro Nórdica",
    description: "Mesa de centro con tablero de madera clara y patas cónicas.",
    price: "CLP$89.990",
    link: "https://example.com/nordic-coffee-table",
    imageUrl: "https://ripley.scene7.com/is/image/Ripley/54502844_02?wid=800&hei=800&qlt=70"
};

const classicArmchair: Furniture = {
    name: "Sillón Clásico Velvet",
    description: "Elegante sillón tapizado en terciopelo azul profundo con detalles en madera oscura.",
    price: "CLP$189.990",
    link: "https://example.com/classic-armchair",
    imageUrl: "https://homecenter.scene7.com/is/image/SodimacCL/3241470?wid=800&hei=800&qlt=70"
};

const bohemianRug: Furniture = {
    name: "Alfombra Bohemio Étnica",
    description: "Alfombra de lana con patrones geométricos y flecos, en tonos tierra y crema.",
    price: "CLP$129.990",
    link: "https://example.com/bohemian-rug",
    imageUrl: "https://falabella.scene7.com/is/image/Falabella/12345678_1?wid=800&hei=800&qlt=70"
};

const industrialLamp: Furniture = {
    name: "Lámpara de Pie Industrial",
    description: "Lámpara de pie de metal negro con diseño de trípode y foco visible.",
    price: "CLP$75.990",
    link: "https://example.com/industrial-lamp",
    imageUrl: "https://falabella.scene7.com/is/image/Falabella/88267277_1?wid=800&hei=800&qlt=70"
};

const rusticBookshelf: Furniture = {
    name: "Estantería Rústica de Madera",
    description: "Estantería robusta de madera maciza con acabado envejecido.",
    price: "CLP$249.990",
    link: "https://example.com/rustic-bookshelf",
    imageUrl: "https://ripley.scene7.com/is/image/Ripley/54502844_02?wid=800&hei=800&qlt=70"
};

// --- Seed Data ---
export const initialSeedData = {
    projects: [
        {
            id: 'project-1',
            name: 'Mi Rincón Mágico 1',
            originalImage: `data:${baseLivingRoom.mimeType};base64,${baseLivingRoom.data}`,
            originalImageBase64: baseLivingRoom,
            analysis: 'Esta es una sala de estar moderna con tonos neutros y un gran ventanal.',
            styleVariations: [
                {
                    style_name: 'Moderno',
                    description: 'Un espacio moderno y minimalista, con líneas limpias y una paleta de colores neutros.',
                    color_palette: ['#F5F5F5', '#E0E0E0', '#B0BEC5', '#607D8B', '#263238'].map(c => lightenColor(c, 5)),
                    furniture_recommendations: [
                        modernSofa,
                        { ...nordicCoffeeTable, name: "Mesa Auxiliar Geométrica", description: "Mesa de centro con base de metal y tapa de cristal, ideal para un toque contemporáneo.", link: "https://example.com/modern-table", price: "CLP$120.000", imageUrl: "https://falabella.scene7.com/is/image/Falabella/88267277_1?wid=800&hei=800&qlt=70" },
                        { ...industrialLamp, name: "Lámpara de Pie Arco", description: "Lámpara de pie con diseño de arco y base de mármol, perfecta para iluminar un rincón de lectura.", link: "https://example.com/arc-lamp", price: "CLP$95.000", imageUrl: "https://ripley.scene7.com/is/image/Ripley/54502844_02?wid=800&hei=800&qlt=70" },
                    ],
                    imageUrl: `data:${modernLivingRoom.mimeType};base64,${modernLivingRoom.data}`,
                    imageBase64: modernLivingRoom,
                    iterations: [],
                    comments: [{ id: 'comment-1', text: '¡Me encanta este estilo, tan limpio y elegante!', createdAt: new Date().toISOString() }],
                },
                {
                    style_name: 'Nórdico',
                    description: 'Ambiente nórdico luminoso, con maderas claras, textiles acogedores y mucha luz natural.',
                    color_palette: ['#FFFFFF', '#F0F4F8', '#D7E0E8', '#9FB3C8', '#425463'].map(c => lightenColor(c, 10)),
                    furniture_recommendations: [
                        nordicCoffeeTable,
                        { ...modernSofa, name: "Sofá Escandinavo", description: "Sofá de tres plazas con estructura de madera visible y tapizado en lino claro.", link: "https://example.com/scandi-sofa", price: "CLP$450.000", imageUrl: "https://homecenter.scene7.com/is/image/SodimacCL/3241470?wid=800&hei=800&qlt=70" },
                        { ...bohemianRug, name: "Alfombra de Pelo Largo", description: "Alfombra suave y mullida en color crema, ideal para dar calidez al espacio.", link: "https://example.com/shaggy-rug", price: "CLP$70.000", imageUrl: "https://falabella.scene7.com/is/image/Falabella/12345678_1?wid=800&hei=800&qlt=70" },
                    ],
                    imageUrl: `data:${nordicLivingRoom.mimeType};base64,${nordicLivingRoom.data}`,
                    imageBase64: nordicLivingRoom,
                    iterations: [],
                    comments: [],
                },
                 {
                    style_name: 'Clásico',
                    description: 'Diseño clásico con muebles robustos, detalles ornamentados y una atmósfera atemporal.',
                    color_palette: ['#FDF5E6', '#E6D7C8', '#BCAAA4', '#795548', '#3E2723'].map(c => darkenColor(c, 5)),
                    furniture_recommendations: [
                        classicArmchair,
                        { ...rusticBookshelf, name: "Consola de Madera Clásica", description: "Consola con patas torneadas y acabado en nogal, perfecta para un hall de entrada elegante.", link: "https://example.com/classic-console", price: "CLP$210.000", imageUrl: "https://ripley.scene7.com/is/image/Ripley/54502844_02?wid=800&hei=800&qlt=70" },
                        { ...industrialLamp, name: "Candelabro de Cristal", description: "Lámpara de techo estilo candelabro con lágrimas de cristal, añadiendo un toque de lujo.", link: "https://example.com/chandelier", price: "CLP$300.000", imageUrl: "https://falabella.scene7.com/is/image/Falabella/88267277_1?wid=800&hei=800&qlt=70" },
                    ],
                    imageUrl: `data:${classicLivingRoom.mimeType};base64,${classicLivingRoom.data}`,
                    imageBase64: classicLivingRoom,
                    iterations: [],
                    comments: [],
                },
                {
                    style_name: 'Bohemio',
                    description: 'Espacio bohemio con texturas variadas, colores vibrantes, elementos naturales y un toque exótico.',
                    color_palette: ['#FDF5E6', '#F5DEB3', '#D2B48C', '#8B4513', '#228B22'].map(c => lightenColor(c, 5)),
                    furniture_recommendations: [
                        bohemianRug,
                        { ...modernSofa, name: "Puff de Yute", description: "Puff redondo de yute trenzado, ideal para asientos informales o como reposapiés.", link: "https://example.com/jute-pouf", price: "CLP$45.000", imageUrl: "https://homecenter.scene7.com/is/image/SodimacCL/3241470?wid=800&hei=800&qlt=70" },
                        { ...nordicCoffeeTable, name: "Mesa Auxiliar de Madera Tallada", description: "Mesa pequeña de madera con detalles tallados a mano, perfecta para un ambiente bohemio.", link: "https://example.com/carved-table", price: "CLP$60.000", imageUrl: "https://ripley.scene7.com/is/image/Ripley/54502844_02?wid=800&hei=800&qlt=70" },
                    ],
                    imageUrl: `data:${bohemianLivingRoom.mimeType};base64,${bohemianLivingRoom.data}`,
                    imageBase64: bohemianLivingRoom,
                    iterations: [],
                    comments: [],
                },
                {
                    style_name: 'Industrial',
                    description: 'Diseño industrial con ladrillo expuesto, metal y madera, creando un ambiente urbano y rústico.',
                    color_palette: ['#A9A9A9', '#808080', '#696969', '#4F4F4F', '#2F4F4F'].map(c => darkenColor(c, 5)),
                    furniture_recommendations: [
                        industrialLamp,
                        { ...modernSofa, name: "Sofá Chesterfield de Cuero", description: "Sofá de cuero envejecido con capitoné, un clásico que encaja perfectamente en el estilo industrial.", link: "https://example.com/leather-chesterfield", price: "CLP$750.000", imageUrl: "https://falabella.scene7.com/is/image/Falabella/88267277_1?wid=800&hei=800&qlt=70" },
                        { ...rusticBookshelf, name: "Mesa de Comedor Industrial", description: "Mesa con tablero de madera maciza y patas de metal, ideal para un estilo robusto.", link: "https://example.com/industrial-dining-table", price: "CLP$320.000", imageUrl: "https://ripley.scene7.com/is/image/Ripley/54502844_02?wid=800&hei=800&qlt=70" },
                    ],
                    imageUrl: `data:${industrialLivingRoom.mimeType};base64,${industrialLivingRoom.data}`,
                    imageBase64: industrialLivingRoom,
                    iterations: [],
                    comments: [],
                },
                {
                    style_name: 'Rústico',
                    description: 'Ambiente rústico y cálido, con muebles de madera natural, elementos artesanales y colores terrosos.',
                    color_palette: ['#F5F5DC', '#D2B48C', '#BC8F8F', '#8B4513', '#694F3C'].map(c => darkenColor(c, 2)),
                    furniture_recommendations: [
                        rusticBookshelf,
                        { ...bohemianRug, name: "Mesa de Centro de Tronco", description: "Mesa de centro hecha de un tronco de árbol pulido, con un toque natural y orgánico.", link: "https://example.com/log-coffee-table", price: "CLP$150.000", imageUrl: "https://homecenter.scene7.com/is/image/SodimacCL/3241470?wid=800&hei=800&qlt=70" },
                        { ...classicArmchair, name: "Sillón de Mimbre", description: "Sillón individual de mimbre con cojines de lino, perfecto para un rincón de relajación rústico.", link: "https://example.com/wicker-armchair", price: "CLP$90.000", imageUrl: "https://falabella.scene7.com/is/image/Falabella/12345678_1?wid=800&hei=800&qlt=70" },
                    ],
                    imageUrl: `data:${rusticLivingRoom.mimeType};base64,${rusticLivingRoom.data}`,
                    imageBase64: rusticLivingRoom,
                    iterations: [],
                    comments: [],
                },
            ],
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        },
        {
            id: 'project-2',
            name: 'Mi Santuario Personal',
            originalImage: `data:${baseBedroom.mimeType};base64,${baseBedroom.data}`,
            originalImageBase64: baseBedroom,
            analysis: 'Este es un dormitorio acogedor con una cama grande y luz tenue.',
            styleVariations: [
                {
                    style_name: 'Nórdico',
                    description: 'Dormitorio nórdico que invita al descanso, con textiles suaves y un ambiente sereno.',
                    color_palette: ['#F8F8F8', '#ECEFF1', '#CFD8DC', '#90A4AE', '#546E7A'].map(c => lightenColor(c, 7)),
                    furniture_recommendations: [
                        { ...nordicCoffeeTable, name: "Velador Flotante", description: "Mesa de noche flotante de madera clara con un cajón, ideal para espacios pequeños.", link: "https://example.com/floating-nightstand", price: "CLP$55.000", imageUrl: "https://ripley.scene7.com/is/image/Ripley/54502844_02?wid=800&hei=800&qlt=70" },
                        { ...modernSofa, name: "Cama Plataforma Escandinava", description: "Cama de diseño simple con estructura de madera y cabecero tapizado en gris claro.", link: "https://example.com/scandi-platform-bed", price: "CLP$380.000", imageUrl: "https://falabella.scene7.com/is/image/Falabella/88267277_1?wid=800&hei=800&qlt=70" },
                        { ...bohemianRug, name: "Manta Tejida a Mano", description: "Manta de lana gruesa tejida a mano en color blanco roto, perfecta para la cama.", link: "https://example.com/knitted-throw", price: "CLP$35.000", imageUrl: "https://falabella.scene7.com/is/image/Falabella/12345678_1?wid=800&hei=800&qlt=70" },
                    ],
                    imageUrl: `data:${nordicLivingRoom.mimeType};base64,${nordicLivingRoom.data}`, // Using a living room dummy for now
                    imageBase64: nordicLivingRoom,
                    iterations: [],
                    comments: [],
                },
            ],
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        },
    ],
    favorites: [
        {
            id: 'fav-1',
            projectId: 'project-1',
            projectName: 'Mi Rincón Mágico 1',
            favoritedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            styleVariation: {
                style_name: 'Moderno',
                description: 'Un espacio moderno y minimalista, con líneas limpias y una paleta de colores neutros.',
                color_palette: ['#F5F5F5', '#E0E0E0', '#B0BEC5', '#607D8B', '#263238'].map(c => lightenColor(c, 5)),
                furniture_recommendations: [
                    modernSofa,
                    { ...nordicCoffeeTable, name: "Mesa Auxiliar Geométrica", description: "Mesa de centro con base de metal y tapa de cristal, ideal para un toque contemporáneo.", link: "https://example.com/modern-table", price: "CLP$120.000", imageUrl: "https://falabella.scene7.com/is/image/Falabella/88267277_1?wid=800&hei=800&qlt=70" },
                    { ...industrialLamp, name: "Lámpara de Pie Arco", description: "Lámpara de pie con diseño de arco y base de mármol, perfecta para iluminar un rincón de lectura.", link: "https://example.com/arc-lamp", price: "CLP$95.000", imageUrl: "https://ripley.scene7.com/is/image/Ripley/54502844_02?wid=800&hei=800&qlt=70" },
                ],
                imageUrl: `data:${modernLivingRoom.mimeType};base64,${modernLivingRoom.data}`,
                imageBase64: modernLivingRoom,
                iterations: [],
                comments: [],
            },
        },
    ],
};