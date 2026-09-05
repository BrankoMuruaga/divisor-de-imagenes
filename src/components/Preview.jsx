import { useState, useMemo, useRef, useEffect } from "react";
import { calculateTiles } from "../utils/tileCalculator";
import { getPaperSize } from "../utils/paperSizes";
import { downloadSingleTilePng } from "../utils/canvasUtils";
import { generatePDF } from "../utils/pdfGenerator";
import { generateZIP } from "../utils/zipGenerator";
import DownloadSelectionPanel from "./DownloadSelectionPanel";

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
  showLabels = true,
  onOpenCropper,
  hasCropped,
  onResetCrop,
}) {
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [isDownloadingTile, setIsDownloadingTile] = useState(false);

  const viewportRef = useRef(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!viewportRef.current) return;
    const updateSize = () => {
      if (viewportRef.current) {
        const { clientWidth, clientHeight } = viewportRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setViewportSize({ width: clientWidth, height: clientHeight });
        }
      }
    };

    updateSize();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setViewportSize({
            width: Math.round(width),
            height: Math.round(height),
          });
        }
      }
    });

    observer.observe(viewportRef.current);
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

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

  const { previewWidth, previewHeight } = useMemo(() => {
    if (!imageWidth || !imageHeight)
      return { previewWidth: 0, previewHeight: 0 };
    const aspectRatio = imageWidth / imageHeight;

    // Calcular el espacio disponible máximo dentro del contenedor
    const padding = 32;
    const availW = Math.max(
      280,
      (viewportSize.width || (typeof window !== "undefined" ? window.innerWidth * 0.45 : 800)) - padding,
    );
    const availH = Math.max(
      280,
      (viewportSize.height || (typeof window !== "undefined" ? window.innerHeight * 0.75 : 600)) - padding,
    );

    let w = availW;
    let h = availW / aspectRatio;

    if (h > availH) {
      h = availH;
      w = availH * aspectRatio;
    }

    return {
      previewWidth: Math.round(w),
      previewHeight: Math.round(h),
    };
  }, [imageWidth, imageHeight, viewportSize]);

  const handleTileClick = (index) => {
    setSelectedTiles((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleDownloadSelected = async (format) => {
    if (selectedTiles.length === 0) return;
    setIsDownloadingTile(true);
    
    // Ordenar los índices para mantener el orden lógico de las hojas
    const selectedIndices = [...selectedTiles].sort((a, b) => a - b);
    const tilesToDownload = selectedIndices.map((i) => tiles[i]);
    
    try {
      if (format === "PDF") {
        const exportOptions = {
          includeCoverPage: false,
          cols: cols,
          rows: rows,
          overlapMm,
          onProgress: () => {},
        };
        await generatePDF(
          tilesToDownload,
          imageSrc,
          paper,
          dpi,
          finalWidthMm,
          finalHeightMm,
          printerMarginMm,
          showLabels,
          exportOptions
        );
      } else if (format === "PNG") {
        if (tilesToDownload.length === 1) {
          await downloadSingleTilePng({
            tile: tilesToDownload[0],
            imageSrc,
            paper,
            dpi,
            printerMarginMm,
            showLabels,
          });
        } else {
          const exportOptions = {
            includeCoverPage: false,
            cols: cols,
            rows: rows,
            overlapMm,
            onProgress: () => {},
          };
          await generateZIP(
            tilesToDownload,
            imageSrc,
            paper,
            dpi,
            finalWidthMm,
            finalHeightMm,
            printerMarginMm,
            showLabels,
            exportOptions
          );
        }
      }
    } catch (err) {
      console.error("Error al descargar hojas seleccionadas:", err);
      alert("No se pudo descargar las hojas seleccionadas.");
    } finally {
      setIsDownloadingTile(false);
    }
  };

  if (!imageSrc) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-400">Subí una imagen para ver el preview</p>
      </div>
    );
  }

  return (
    <section className="relative w-full h-full flex flex-col flex-1 min-h-0 gap-3">
      {/* Barra de herramientas superior del Preview */}
      <div className="flex flex-wrap justify-between items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-bold text-gray-800">
            Vista previa
          </label>
          <span className="text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full font-medium">
            {cols} × {rows} ({tiles.length} {tiles.length === 1 ? "hoja" : "hojas"})
          </span>
        </div>

        {/* Controles de edición, visualización y zoom */}
        <div className="flex items-center gap-2">
          {/* Botón Recortar encuadre */}
          {onOpenCropper && (
            <button
              type="button"
              onClick={onOpenCropper}
              title="Recortar o encuadrar imagen"
              className="text-xs px-2.5 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
            >
              <span>📐</span> Recortar
            </button>
          )}

          {hasCropped && onResetCrop && (
            <button
              type="button"
              onClick={onResetCrop}
              className="text-xs text-gray-500 hover:text-gray-800 underline cursor-pointer"
              title="Restablecer a la imagen sin recortar"
            >
              Restablecer
            </button>
          )}

          {/* Botón toggle grilla */}
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            title="Alternar cuadrícula y numeración"
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
              showGrid
                ? "bg-primary-50 border-primary-300 text-primary-700"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {showGrid ? "Ocultar guías" : "Ver guías"}
          </button>

          {/* Controles Zoom */}
          <div className="flex items-center bg-white border border-gray-300 rounded-md shadow-xs overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
              disabled={zoom <= 0.75}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-40 cursor-pointer font-bold"
              title="Alejar"
            >
              −
            </button>
            <span
              onClick={() => setZoom(1)}
              className="px-2 py-1 border-x border-gray-200 text-gray-700 select-none cursor-pointer hover:bg-gray-50"
              title="Restablecer zoom al 100%"
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))}
              disabled={zoom >= 2.5}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-40 cursor-pointer font-bold"
              title="Acercar"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor scrolleable del preview: se expande a todo el espacio disponible */}
      <div
        ref={viewportRef}
        className="relative flex-1 w-full min-h-[400px] xl:min-h-0 bg-gray-100/30 rounded-xl border border-gray-300 overflow-auto flex p-4 scrollbar-none"
      >
        {/* Contenedor espaciador con el tamaño final tras el zoom */}
        <div
          className="m-auto flex items-center justify-center transition-all duration-100 flex-shrink-0"
          style={{
            width: `${previewWidth * zoom}px`,
            height: `${previewHeight * zoom}px`,
          }}
        >
          {/* El elemento escalado visualmente */}
          <div
            className="relative bg-white shadow-xl origin-center flex-shrink-0 pointer-events-auto"
            style={{
              width: `${previewWidth}px`,
              height: `${previewHeight}px`,
              transform: `scale(${zoom})`,
            }}
          >
            <img
              src={imageSrc}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />

          {/* Grilla SVG de tiles interactiva */}
          {showGrid && (
            <svg
              className="absolute inset-0"
              width={previewWidth}
              height={previewHeight}
            >
              {tiles.map((tile, idx) => {
                const x = (tile.xMm / finalWidthMm) * previewWidth;
                const y = (tile.yMm / finalHeightMm) * previewHeight;
                const w = (tile.widthMm / finalWidthMm) * previewWidth;
                const h = (tile.heightMm / finalHeightMm) * previewHeight;

                const isSelected = selectedTiles.includes(idx);

                return (
                  <g
                    key={idx}
                    onClick={() => handleTileClick(idx)}
                    className="cursor-pointer group"
                  >
                    {/* Área sensible al hover/click */}
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill={
                        isSelected
                          ? "rgba(37, 99, 235, 0.28)"
                          : "rgba(0, 0, 0, 0.001)"
                      }
                      className="group-hover:fill-blue-500/15 transition-colors"
                    />

                    {/* Borde del tile */}
                    <rect
                      x={x}
                      y={y}
                      width={w}
                      height={h}
                      fill="none"
                      stroke={isSelected ? "#1d4ed8" : "var(--color-primary-500)"}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      strokeDasharray={isSelected ? "none" : "4 2"}
                    />

                    {/* Etiqueta de la hoja */}
                    <text
                      x={x + w / 2}
                      y={y + h / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isSelected ? "#1d4ed8" : "var(--color-primary-600)"}
                      fontSize={isSelected ? "16" : "14"}
                      fontWeight="bold"
                      style={{
                        textShadow: "0 0 4px white, 0 0 4px white",
                        pointerEvents: "none",
                      }}
                    >
                      {tile.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>
        </div>
      </div>

      {/* Panel flotante inferior de selección múltiple */}
      <DownloadSelectionPanel
        selectedTiles={selectedTiles}
        isDownloadingTile={isDownloadingTile}
        onDownload={handleDownloadSelected}
        onClearSelection={() => setSelectedTiles([])}
      />
    </section>
  );
}

