import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { loadImage, createTileCanvas, createAssemblyGuideCanvas } from "./canvasUtils";
import { drawPdfCropMarks } from "./drawMarks";

export async function generatePDF(
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

  const pdf = new jsPDF({
    orientation: paper.width > paper.height ? "landscape" : "portrait",
    unit: "mm",
    format: [paper.width, paper.height],
  });

  const totalSteps = tiles.length + (includeCoverPage ? 1 : 0);
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
    const guideData = guideCanvas.toDataURL("image/jpeg", 0.9);
    pdf.addImage(
      guideData,
      "JPEG",
      0,
      0,
      paper.width,
      paper.height,
      undefined,
      "MEDIUM",
    );
    currentStep++;
    // Liberar canvas de memoria
    guideCanvas.width = 0;
    guideCanvas.height = 0;
  }

  // 2. Páginas individuales de tiles
  for (let i = 0; i < tiles.length; i++) {
    // Ceder el hilo de ejecución para que la UI se actualice fluidamente
    await new Promise((resolve) => setTimeout(resolve, 0));

    currentStep++;
    if (onProgress) {
      onProgress(
        currentStep,
        totalSteps,
        `Procesando hoja ${i + 1} de ${tiles.length}...`,
      );
    }

    const tile = tiles[i];
    const tileCanvas = createTileCanvas(tile, img);
    const dataUrl = tileCanvas.toDataURL("image/jpeg", 0.92);

    if (includeCoverPage || i > 0) {
      pdf.addPage(
        [paper.width, paper.height],
        paper.width > paper.height ? "landscape" : "portrait",
      );
    }

    pdf.addImage(
      dataUrl,
      "JPEG",
      printerMarginMm,
      printerMarginMm,
      tile.widthMm,
      tile.heightMm,
      undefined,
      "MEDIUM",
    );

    // Marcas de corte profesionales en las esquinas
    drawPdfCropMarks(
      pdf,
      printerMarginMm,
      printerMarginMm,
      tile.widthMm,
      tile.heightMm,
      4,
      1,
    );

    // Recuadro punteado tenue de corte
    pdf.setLineDashPattern([2, 2], 0);
    pdf.setDrawColor(180, 180, 180);
    pdf.rect(
      printerMarginMm,
      printerMarginMm,
      tile.widthMm,
      tile.heightMm,
      "S",
    );
    pdf.setLineDashPattern([], 0);

    if (showLabels) {
      pdf.setFontSize(8);
      const text = tile.printLabel;
      const xPos = paper.width / 2;
      const yPos = paper.height - printerMarginMm - 2;

      const textWidth = pdf.getTextWidth(text);
      pdf.setFillColor(255, 255, 255);
      pdf.rect(xPos - textWidth / 2 - 1, yPos - 2.5, textWidth + 2, 3.5, "F");

      pdf.setTextColor(100);
      pdf.text(text, xPos, yPos, { align: "center" });
    }

    // Limpiar canvas
    tileCanvas.width = 0;
    tileCanvas.height = 0;
  }

  if (onProgress) {
    onProgress(totalSteps, totalSteps, "Guardando archivo PDF...");
  }

  saveAs(pdf.output("blob"), "imagen-dividida.pdf");
}

