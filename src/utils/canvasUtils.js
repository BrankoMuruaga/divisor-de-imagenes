import { saveAs } from "file-saver";
import { drawOverlapMarks, drawCanvasCropMarks } from "./drawMarks";
import { mmToPx } from "./units";

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

/**
 * Descarga una sola hoja como archivo PNG en alta calidad
 */
export async function downloadSingleTilePng({
  tile,
  imageSrc,
  paper,
  dpi,
  printerMarginMm,
  showLabels,
}) {
  const img = await loadImage(imageSrc);
  const tileCanvas = createTileCanvas(tile, img);

  const pageCanvas = document.createElement("canvas");
  pageCanvas.width = mmToPx(paper.width, dpi);
  pageCanvas.height = mmToPx(paper.height, dpi);
  const ctx = pageCanvas.getContext("2d");

  // Fondo blanco
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

  const marginPx = mmToPx(printerMarginMm, dpi);
  ctx.drawImage(tileCanvas, marginPx, marginPx);

  // Marcas de corte
  drawCanvasCropMarks(
    ctx,
    marginPx,
    marginPx,
    tileCanvas.width,
    tileCanvas.height,
  );

  if (showLabels) {
    const text = tile.printLabel;
    const fontSize = Math.max(22, pageCanvas.width * 0.015);
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textWidth = ctx.measureText(text).width;
    const paddingX = fontSize * 0.6;
    const paddingY = fontSize * 0.3;
    const bgWidth = textWidth + paddingX * 2;
    const bgHeight = fontSize + paddingY * 2;

    const xPos = pageCanvas.width / 2;
    const yPos = pageCanvas.height - marginPx - fontSize / 2 - pageCanvas.height * 0.005;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(xPos - bgWidth / 2, yPos - bgHeight / 2, bgWidth, bgHeight);
    ctx.fillStyle = "#333333";
    ctx.fillText(text, xPos, yPos);
  }

  pageCanvas.toBlob((blob) => {
    saveAs(blob, `hoja-${tile.label}.png`);
  }, "image/png");
}

/**
 * Crea un canvas con la miniatura completa y el diagrama de montaje para la portada
 */
export function createAssemblyGuideCanvas({
  img,
  tiles,
  cols,
  rows,
  finalWidthMm,
  finalHeightMm,
  paper,
  overlapMm,
  printerMarginMm,
}) {
  const width = 1200;
  const height = Math.round((paper.height / paper.width) * width);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Fondo blanco papel
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Encabezado
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "bold 34px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Guía de Montaje y Ensamblado", width / 2, 70);

  // Subtítulo con especificaciones
  ctx.font = "18px 'Plus Jakarta Sans', sans-serif";
  ctx.fillStyle = "#555555";
  const specs = `Dimensiones finales: ${(finalWidthMm / 10).toFixed(1)} × ${(finalHeightMm / 10).toFixed(1)} cm | Papel: ${paper.label} | Total: ${tiles.length} hojas (${cols} col × ${rows} filas) | Solape: ${overlapMm} mm`;
  ctx.fillText(specs, width / 2, 105);

  // Área central para la miniatura
  const maxThumbW = width * 0.78;
  const maxThumbH = height * 0.62;
  const imgAspect = img.width / img.height;

  let thumbW = maxThumbW;
  let thumbH = maxThumbW / imgAspect;
  if (thumbH > maxThumbH) {
    thumbH = maxThumbH;
    thumbW = maxThumbH * imgAspect;
  }

  const thumbX = (width - thumbW) / 2;
  const thumbY = 135 + (maxThumbH - thumbH) / 2;

  // Sombra suave en miniatura
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;
  ctx.drawImage(img, thumbX, thumbY, thumbW, thumbH);
  ctx.shadowColor = "transparent";

  // Marco exterior
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 2;
  ctx.strokeRect(thumbX, thumbY, thumbW, thumbH);

  // Dibujar cuadrícula de tiles sobre la miniatura
  tiles.forEach((tile) => {
    const tx = thumbX + (tile.xMm / finalWidthMm) * thumbW;
    const ty = thumbY + (tile.yMm / finalHeightMm) * thumbH;
    const tw = (tile.widthMm / finalWidthMm) * thumbW;
    const th = (tile.heightMm / finalHeightMm) * thumbH;

    // Recuadro
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(tx, ty, tw, th);
    ctx.setLineDash([]);

    // Etiqueta del tile
    const badgeW = 46;
    const badgeH = 24;
    const bx = tx + tw / 2 - badgeW / 2;
    const by = ty + th / 2 - badgeH / 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(bx, by, badgeW, badgeH);
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, badgeW, badgeH);

    ctx.fillStyle = "#1e40af";
    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tile.label, bx + badgeW / 2, by + badgeH / 2);
  });

  // Instrucciones de montaje al pie
  const footerY = height - 100;
  ctx.fillStyle = "#f3f4f6";
  ctx.fillRect(width * 0.08, footerY - 15, width * 0.84, 85);
  ctx.strokeStyle = "#e5e7eb";
  ctx.strokeRect(width * 0.08, footerY - 15, width * 0.84, 85);

  ctx.fillStyle = "#111827";
  ctx.font = "bold 16px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("Instrucciones de Ensamblado:", width * 0.1, footerY + 10);

  ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
  ctx.fillStyle = "#4b5563";
  ctx.fillText(
    "1. Recortá los bordes no imprimibles de cada hoja guiándote por las marcas de corte.",
    width * 0.1,
    footerY + 34,
  );
  ctx.fillText(
    "2. Superponé las solapas según la numeración (primero la fila 1 de izquierda a derecha, luego las siguientes).",
    width * 0.1,
    footerY + 54,
  );

  return canvas;
}

