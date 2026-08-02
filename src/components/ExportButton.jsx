import { useState } from "react";
import { OUTPUT_FORMATS } from "../constants";
import { generatePDF } from "../utils/pdfGenerator";
import { generateZIP } from "../utils/zipGenerator";
import { calculateTiles } from "../utils/tileCalculator";
import { getPaperSize } from "../utils/paperSizes";

export default function ExportButton({
  imageSrc,
  imageWidth,
  imageHeight,
  finalWidthMm,
  finalHeightMm,
  paperSize,
  orientation,
  overlapMm,
  dpi,
  outputFormat,
  printerMarginMm,
  showLabels,
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!imageSrc) return;

    setIsExporting(true);

    try {
      const paper = getPaperSize(paperSize, orientation);
      const { tiles } = calculateTiles(
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

      if (outputFormat === OUTPUT_FORMATS.PDF) {
        await generatePDF(
          tiles,
          imageSrc,
          paper,
          dpi,
          finalWidthMm,
          finalHeightMm,
          printerMarginMm,
          showLabels,
        );
      } else {
        await generateZIP(
          tiles,
          imageSrc,
          paper,
          dpi,
          finalWidthMm,
          finalHeightMm,
          printerMarginMm,
          showLabels,
        );
      }
    } catch (error) {
      console.error("Error al exportar:", error);
      alert("Error al generar el archivo. Intentá de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={!imageSrc || isExporting}
      className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium 
        hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
        transition-colors flex items-center justify-center gap-2 cursor-pointer"
    >
      {isExporting ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Generando...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Descargar {outputFormat === OUTPUT_FORMATS.PDF ? "PDF" : "ZIP"}
        </>
      )}
    </button>
  );
}
