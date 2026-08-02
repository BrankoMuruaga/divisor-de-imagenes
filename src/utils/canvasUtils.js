import { drawOverlapMarks } from "./drawMarks";

// Carga la imagen de forma asíncrona
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Crea y devuelve un canvas que contiene únicamente el recorte y sus marcas
export function createTileCanvas(tile, img) {
  const canvas = document.createElement("canvas");
  // Se usa Math.round para evitar píxeles sub-pixelados
  canvas.width = Math.round(tile.destWidth);
  canvas.height = Math.round(tile.destHeight);
  const ctx = canvas.getContext("2d");

  // Dibujar la porción exacta de la imagen original
  ctx.drawImage(
    img,
    tile.sourceX,
    tile.sourceY,
    tile.sourceWidth,
    tile.sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  if (typeof drawOverlapMarks === "function") {
    drawOverlapMarks(ctx, tile);
  }

  return canvas;
}
