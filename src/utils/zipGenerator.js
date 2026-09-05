import JSZip from "jszip";
import { saveAs } from "file-saver";
import { mmToPx } from "./units";
import {
  loadImage,
  createTileCanvas,
  createAssemblyGuideCanvas,
} from "./canvasUtils";
import { drawCanvasCropMarks } from "./drawMarks";

export async function generateZIP(
  tiles,
  imageSrc,
  paper,
  dpi,
  finalWidthMm,
  finalHeightMm,
  printerMarginMm,
  showLabels,
  options = {},
) {
  const {
    includeCoverPage = true,
    cols = 1,
    rows = 1,
    overlapMm = 0,
    onProgress,
  } = options;

  const zip = new JSZip();
  const totalSteps = tiles.length + (includeCoverPage ? 1 : 0) + 1;
  let currentStep = 0;

  if (onProgress) {
    onProgress(0, totalSteps, "Cargando imagen...");
  }

  const img = await loadImage(imageSrc);

  // 1. Portada / Guía de Montaje (Opcional)
  if (includeCoverPage) {
    if (onProgress) {
      onProgress(1, totalSteps, "Generando guía de montaje...");
    }
    const guideCanvas = createAssemblyGuideCanvas({
      img,
      tiles,
      cols,
      rows,
      finalWidthMm,
      finalHeightMm,
      paper,
      overlapMm,
      printerMarginMm,
    });
    const guideBlob = await new Promise((resolve) =>
      guideCanvas.toBlob(resolve, "image/png"),
    );
    zip.file("00-guia-de-montaje.png", guideBlob);
    currentStep++;
    guideCanvas.width = 0;
    guideCanvas.height = 0;
  }

  // 2. Páginas individuales de tiles
  for (let i = 0; i < tiles.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));

    currentStep++;
    if (onProgress) {
      onProgress(
        currentStep,
        totalSteps,
        `Generando hoja ${i + 1} de ${tiles.length}...`,
      );
    }

    const tile = tiles[i];
    const tileCanvas = createTileCanvas(tile, img);
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = mmToPx(paper.width, dpi);
    pageCanvas.height = mmToPx(paper.height, dpi);
    const ctx = pageCanvas.getContext("2d");

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

    // Recuadro tenue de corte
    ctx.setLineDash([12, 12]);
    ctx.strokeStyle = "rgba(180, 180, 180, 0.7)";
    ctx.lineWidth = Math.max(1.5, pageCanvas.width * 0.0008);
    ctx.strokeRect(marginPx, marginPx, tileCanvas.width, tileCanvas.height);
    ctx.setLineDash([]);

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
      const yPos =
        pageCanvas.height - marginPx - fontSize / 2 - pageCanvas.height * 0.005;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(xPos - bgWidth / 2, yPos - bgHeight / 2, bgWidth, bgHeight);
      ctx.fillStyle = "#333333";
      ctx.fillText(text, xPos, yPos);
    }

    const blob = await new Promise((resolve) =>
      pageCanvas.toBlob(resolve, "image/png"),
    );
    const fileName = `hoja-${String(i + 1).padStart(2, "0")}-${tile.label}.png`;
    zip.file(fileName, blob);

    // Liberar memoria
    tileCanvas.width = 0;
    tileCanvas.height = 0;
    pageCanvas.width = 0;
    pageCanvas.height = 0;
  }

  if (onProgress) {
    onProgress(totalSteps, totalSteps, "Comprimiendo archivo ZIP...");
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "imagen-dividida.zip");
}

