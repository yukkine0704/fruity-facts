/**
 * Convierte un color hexadecimal (ej. #RRGGBB o #RGB) a un string RGBA.
 * @param hex El string del color hexadecimal.
 * @param alpha La opacidad deseada (0.0 a 1.0).
 * @returns Un string RGBA (ej. "rgba(255, 0, 0, 0.5)").
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      `,${alpha})`
    );
  }
  // Si no es un hex válido, o para otros formatos, simplemente retorna una cadena vacía o maneja el error
  console.warn("Invalid Hex color provided to hexToRgba:", hex);
  return `rgba(0, 0, 0, ${alpha})`; // Fallback a negro transparente
};
