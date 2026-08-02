/**
 * Convierte una medida en la unidad dada a milímetros
 */
export function toMm(value, unit) {
  switch (unit) {
    case "mm":
      return value;
    case "cm":
      return value * 10;
    case "m":
      return value * 1000;
    default:
      return value;
  }
}

/**
 * Convierte milímetros a la unidad dada
 */
export function fromMm(mm, unit) {
  switch (unit) {
    case "mm":
      return mm;
    case "cm":
      return mm / 10;
    case "m":
      return mm / 1000;
    default:
      return mm;
  }
}

/**
 * Convierte milímetros a píxeles usando el DPI dado
 */
export function mmToPx(mm, dpi) {
  return (mm / 25.4) * dpi;
}

/**
 * Convierte píxeles a milímetros usando el DPI dado
 */
export function pxToMm(px, dpi) {
  return (px / dpi) * 25.4;
}
