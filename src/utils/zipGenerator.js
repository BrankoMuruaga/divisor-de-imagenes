import JSZip from "jszip";
import { saveAs } from "file-saver";
import { mmToPx } from "./units";
import { loadImage, createTileCanvas } from "./canvasUtils";

export async function generateZIP(
  tiles,
  imageSrc,
  paper,
  dpi,
  finalWidthMm,
  finalHeightMm,
  printerMarginMm,
  showLabels,
) {
  const zip = new JSZip();
  const img = await loadImage(imageSrc);

  for (let i = 0; i < tiles.length; i++) {
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

    // Recuadro de corte
    ctx.setLineDash([15, 15]);
    ctx.strokeStyle = "rgba(150, 150, 150, 0.8)";
    ctx.lineWidth = Math.max(2, pageCanvas.width * 0.001);
    ctx.strokeRect(marginPx, marginPx, tileCanvas.width, tileCanvas.height);
    ctx.setLineDash([]);

    if (showLabels) {
      // Consumimos la nueva propiedad
      const text = tile.printLabel;
      const fontSize = Math.max(24, pageCanvas.width * 0.015);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const textWidth = ctx.measureText(text).width;
      const paddingX = fontSize * 0.5;
      const paddingY = fontSize * 0.3;
      const bgWidth = textWidth + paddingX * 2;
      const bgHeight = fontSize + paddingY * 2;

      const xPos = pageCanvas.width / 2;
      const yPos =
        pageCanvas.height - marginPx - fontSize / 2 - pageCanvas.height * 0.005;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(xPos - bgWidth / 2, yPos - bgHeight / 2, bgWidth, bgHeight);
      ctx.fillStyle = "#666666";
      ctx.fillText(text, xPos, yPos);
    }

    const blob = await new Promise((resolve) =>
      pageCanvas.toBlob(resolve, "image/png"),
    );
    // Usamos el label corto para el nombre del archivo
    const fileName = `hoja-${String(i + 1).padStart(2, "0")}-${tile.label}.png`;
    zip.file(fileName, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "imagen-dividida.zip");
}
