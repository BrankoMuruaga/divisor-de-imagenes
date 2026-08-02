// Tamaños de papel en milímetros (ancho x alto en orientación vertical)
export const PAPER_SIZES = {
  A4: { width: 210, height: 297, label: "A4" },
  A3: { width: 297, height: 420, label: "A3" },
  A2: { width: 420, height: 594, label: "A2" },
  Letter: { width: 215.9, height: 279.4, label: "Carta" },
  Legal: { width: 215.9, height: 355.6, label: "Oficio" },
};

/**
 * Obtiene el tamaño de papel en mm según orientación
 */
export function getPaperSize(paperKey, orientation) {
  const paper = PAPER_SIZES[paperKey];
  if (orientation === "landscape") {
    return {
      width: paper.height,
      height: paper.width,
      label: paper.label,
    };
  }
  return { ...paper };
}
