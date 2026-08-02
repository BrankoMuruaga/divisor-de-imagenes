import { mmToPx } from "./units";

export function calculateTiles(
  imageWidthPx,
  imageHeightPx,
  finalWidthMm,
  finalHeightMm,
  paperWidthMm,
  paperHeightMm,
  overlapMm,
  printerMarginMm,
  dpi,
) {
  const scaledWidthPx = mmToPx(finalWidthMm, dpi);
  const scaledHeightPx = mmToPx(finalHeightMm, dpi);

  // Área imprimible real (papel menos márgenes de impresora)
  const printableWidthMm = paperWidthMm - printerMarginMm * 2;
  const printableHeightMm = paperHeightMm - printerMarginMm * 2;

  // Área útil sin overlap (para calcular cuántas hojas necesito)
  const usableWidthMm = printableWidthMm - overlapMm;
  const usableHeightMm = printableHeightMm - overlapMm;

  // Calcular número de columnas y filas
  const cols = Math.ceil(finalWidthMm / usableWidthMm);
  const rows = Math.ceil(finalHeightMm / usableHeightMm);

  const tiles = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Posición en mm dentro de la imagen final
      const startX = col * usableWidthMm;
      const startY = row * usableHeightMm;

      // Tamaño del tile (lo que voy a imprimir en esta hoja)
      const tileWidth = Math.min(printableWidthMm, finalWidthMm - startX);
      const tileHeight = Math.min(printableHeightMm, finalHeightMm - startY);

      // Coordenadas SOURCE: Qué porción de la imagen ORIGINAL recortar
      const sourceX = (startX / finalWidthMm) * imageWidthPx;
      const sourceY = (startY / finalHeightMm) * imageHeightPx;
      const sourceWidth = (tileWidth / finalWidthMm) * imageWidthPx;
      const sourceHeight = (tileHeight / finalHeightMm) * imageHeightPx;

      // Coordenadas DESTINATION: Tamaño del canvas según DPI
      const destWidth = mmToPx(tileWidth, dpi);
      const destHeight = mmToPx(tileHeight, dpi);

      tiles.push({
        row,
        col,
        label: `${row + 1}-${col + 1}`,
        printLabel: `Fila ${row + 1} de ${rows}, Pos ${col + 1} de ${cols}`,
        xMm: startX,
        yMm: startY,
        widthMm: tileWidth,
        heightMm: tileHeight,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destWidth,
        destHeight,
        pdfX: printerMarginMm,
        pdfY: printerMarginMm,
        hasLeftOverlap: col > 0,
        hasTopOverlap: row > 0,
        hasRightOverlap: col < cols - 1,
        hasBottomOverlap: row < rows - 1,
        overlapPx: mmToPx(overlapMm, dpi),
      });
    }
  }

  return {
    tiles,
    cols,
    rows,
    scaledWidthPx,
    scaledHeightPx,
  };
}
