import { useState } from "react";
import { OUTPUT_FORMATS } from "../constants";
import { generatePDF } from "../utils/pdfGenerator";
import { generateZIP } from "../utils/zipGenerator";
import { calculateTiles } from "../utils/tileCalculator";
import { getPaperSize } from "../utils/paperSizes";

export default function ExportButton({
  includeCoverPage,
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
  const [progress, setProgress] = useState({ current: 0, total: 0, message: "" });

  const handleExport = async () => {
    if (!imageSrc || isExporting) return;

    setIsExporting(true);
    setProgress({ current: 0, total: 100, message: "Iniciando exportación..." });

    try {
      const paper = getPaperSize(paperSize, orientation);
      const { tiles, cols, rows } = calculateTiles(
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

      const exportOptions = {
        includeCoverPage,
        cols,
        rows,
        overlapMm,
        onProgress: (current, total, message) => {
          setProgress({ current, total, message });
        },
      };

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
          exportOptions,
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
          exportOptions,
        );
      }
    } catch (error) {
      console.error("Error al exportar:", error);
      alert("Error al generar el archivo. Por favor, intentá de nuevo.");
    } finally {
      setIsExporting(false);
      setProgress({ current: 0, total: 0, message: "" });
    }
  };

  const percent =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Barra de progreso interactiva */}
      {isExporting && (
        <div className="flex flex-col gap-1.5 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-blue-900 truncate">
              {progress.message || "Procesando hojas..."}
            </span>
            <span className="font-bold text-blue-700 ml-2">{percent}%</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden border border-blue-200">
            <div
              className="bg-primary-600 h-full transition-all duration-150 ease-out rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Botón de exportación */}
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
            Generando ({percent}%)...
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
    </div>
  );
}

