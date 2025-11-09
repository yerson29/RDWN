
import { Project, StyleVariation, FavoriteDesign, ImageBase64 } from './types';

// Función para generar Base64 de un SVG simple que simule una imagen de habitación
const createRoomSvgBase64 = (color: string, text: string = 'Rosi', roomType: string = 'Habitación', aspectRatio: '4:3' | '16:9' = '16:9'): ImageBase64 => {
    const width = 320; // Ancho base para consistencia
    const height = aspectRatio === '16:9' ? 180 : 240; // Alto basado en aspecto
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="${color}"/>
        <text x="${width / 2}" y="${height / 2 - 15}" font-family="Arial, sans-serif" font-size="28" fill="#FFF" text-anchor="middle" alignment-baseline="middle" font-weight="bold">${roomType}</text>
        <text x="${width / 2}" y="${height / 2 + 20}" font-family="Arial, sans-serif" font-size="18" fill="#EEE" text-anchor="middle" alignment-baseline="middle">${text}</text>
        <rect x="20" y="${height - 40}" width="${width - 40}" height="20" fill="${darkenColor(color, 30)}" rx="5" ry="5"/>
        <circle cx="${width - 30}" cy="30" r="10" fill="${lightenColor(color, 20)}" stroke="#FFF" stroke-width="1"/>
    </svg>`;
    return {
        data: btoa(svgContent),
        mimeType: 'image/svg+xml',
    };
};

// Funciones auxiliares para aclarar/oscurecer colores hexadecimales
function lightenColor(hex: string, percent: number) {
    let f = parseInt(hex.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = (f >> 8) & 0x00ff,
        B = f & 0x0000ff;
    return "#" + (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
    ).toString(16).slice(1);
}

function darkenColor(hex: string, percent: number) {
    return lightenColor(hex, -percent);
}

// Nueva imagen real proporcionada por el usuario (en Base64)
const originalImageUserProvided: ImageBase64 = {
    data: 'iVBORw0KGgoAAAANSUhEUgAAARoAAAHKCAMAAABeH015AAAAjVBMVEX///8AAADY2Njo6Oj8/PyysrKdnZ3l5eXQ0NDs7Ozb29vIyMiIiIhSUlLV1dWurq57e3vAwMDMzMyUlJSSkpLw8PDk5OQoKCjq6ury8vK4uLj19fXt7e2+vr6ioqL39/f5+fnExMTX19eFhYVdXV0LCwsbGxvT09NtbW3Ozs5gYGBISEhsbGxPT083Nzej4K+MAAAgAElEQVR4nO2deWPbupbHkY1R7i27t6m3vXm7p3c3d52Ea7Pdu/v/b//+0zVj+UAA2KysrFh0nufz7JzHmV/wA9rQhnakoc8j0109wR5p3N9Lq7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u