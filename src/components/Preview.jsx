import { useMemo } from "react";
import { calculateTiles } from "../utils/tileCalculator";
import { getPaperSize } from "../utils/paperSizes";

export default function Preview({
  imageSrc,
  imageWidth,
  imageHeight,
  finalWidthMm,
  finalHeightMm,
  paperSize,
  orientation,
  overlapMm,
  dpi,
  printerMarginMm,
}) {
  const paper = getPaperSize(paperSize, orientation);

  const { tiles, cols, rows } = useMemo(() => {
    if (!imageWidth || !imageHeight || !finalWidthMm || !finalHeightMm) {
      return { tiles: [], cols: 0, rows: 0 };
    }
    return calculateTiles(
      imageWidth,
      imageHeight,
      finalWidthMm,
      finalHeightMm,
      paper.width,
      paper.height,
      overlapMm,
      printerMarginMm,
      dpi,
    );
  }, [
    imageWidth,
    imageHeight,
    finalWidthMm,
    finalHeightMm,
    paper.width,
    paper.height,
    overlapMm,
    printerMarginMm,
    dpi,
  ]);

  // Tamaño fijo para el preview, basado ÚNICAMENTE en la proporción de la imagen.
  // Esto garantiza que la imagen en pantalla NO cambie de tamaño al modificar los mm finales.
  const maxPreviewDimension = 760;
  const { previewWidth, previewHeight } = useMemo(() => {
    if (!imageWidth || !imageHeight)
      return { previewWidth: 0, previewHeight: 0 };
    const aspectRatio = imageWidth / imageHeight;

    if (aspectRatio >= 1) {
      return {
        previewWidth: maxPreviewDimension,
        previewHeight: maxPreviewDimension / aspectRatio,
      };
    } else {
      return {
        previewHeight: maxPreviewDimension,
        previewWidth: maxPreviewDimension * aspectRatio,
      };
    }
  }, [imageWidth, imageHeight]);

  if (!imageSrc) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-400">Subí una imagen para ver el preview</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Vista previa
        </label>
        <span className="text-xs text-gray-500">
          {cols} × {rows} hojas ({tiles.length} total)
        </span>
      </div>

      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
        <div
          className="relative bg-white shadow-lg overflow-hidden"
          style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
        >
          <img
            src={imageSrc}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Grilla de tiles */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={previewWidth}
            height={previewHeight}
          >
            {tiles.map((tile, idx) => {
              // Mapear los mm físicos al tamaño fijo del preview usando proporciones
              const x = (tile.xMm / finalWidthMm) * previewWidth;
              const y = (tile.yMm / finalHeightMm) * previewHeight;
              const w = (tile.widthMm / finalWidthMm) * previewWidth;
              const h = (tile.heightMm / finalHeightMm) * previewHeight;

              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="none"
                    stroke="var(--color-primary-500)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <text
                    x={x + w / 2}
                    y={y + h / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="var(--color-primary-500)"
                    fontSize="14"
                    fontWeight="bold"
                    style={{ textShadow: "0 0 3px white, 0 0 3px white" }}
                  >
                    {tile.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
