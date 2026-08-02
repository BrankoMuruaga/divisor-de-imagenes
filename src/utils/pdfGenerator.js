import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { loadImage, createTileCanvas } from "./canvasUtils";

export async function generatePDF(
  tiles,
  imageSrc,
  paper,
  dpi,
  finalWidthMm,
  finalHeightMm,
  printerMarginMm,
  showLabels,
) {
  const pdf = new jsPDF({
    orientation: paper.width > paper.height ? "landscape" : "portrait",
    unit: "mm",
    format: [paper.width, paper.height],
  });

  const img = await loadImage(imageSrc);

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];

    const tileCanvas = createTileCanvas(tile, img);
    const dataUrl = tileCanvas.toDataURL("image/jpeg", 0.92);

    if (i > 0) {
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

    // Recuadro de corte
    pdf.setLineDashPattern([2, 2], 0);
    pdf.setDrawColor(150, 150, 150);
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
      // Consumimos la nueva propiedad
      const text = tile.printLabel;
      const xPos = paper.width / 2;
      const yPos = paper.height - printerMarginMm - 2;

      const textWidth = pdf.getTextWidth(text);
      pdf.setFillColor(255, 255, 255);
      pdf.rect(xPos - textWidth / 2 - 1, yPos - 2.5, textWidth + 2, 3.5, "F");

      pdf.setTextColor(100);
      pdf.text(text, xPos, yPos, { align: "center" });
    }
  }

  saveAs(pdf.output("blob"), "imagen-dividida.pdf");
}
