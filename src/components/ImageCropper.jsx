import { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  isOpen,
}) {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Medir dinámicamente el contenedor para que la imagen entre completa sin scroll ni cortes
  useEffect(() => {
    if (!isOpen) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // Margen de seguridad para que la imagen y los manejadores de recorte quepan perfectamente
        setContainerSize({
          width: Math.max(0, clientWidth - 20),
          height: Math.max(0, clientHeight - 20),
        });
      }
    };

    updateDimensions();

    const ro = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    window.addEventListener("resize", updateDimensions);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [isOpen]);

  const onImageLoad = useCallback((e) => {
    imgRef.current = e.currentTarget;
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, width / height, width, height),
      width,
      height,
    );
    setCrop(initialCrop);
    setCompletedCrop(convertToPixelCrop(initialCrop, width, height));
  }, []);

  const handleApplyCrop = () => {
    const image = imgRef.current;
    if (!image) return;

    // Obtener crop en píxeles
    const pixelCrop =
      completedCrop?.width && completedCrop?.height
        ? completedCrop
        : crop
        ? convertToPixelCrop(crop, image.width, image.height)
        : null;

    if (!pixelCrop || !pixelCrop.width || !pixelCrop.height) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(pixelCrop.width * scaleX);
    canvas.height = Math.round(pixelCrop.height * scaleY);

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const croppedDataUrl = canvas.toDataURL("image/png");
    onCropComplete(croppedDataUrl, canvas.width, canvas.height);
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-1.5 sm:p-3 font-doodle">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-6xl h-[calc(100dvh-0.75rem)] sm:h-[calc(100dvh-1.5rem)] flex flex-col p-3 sm:p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Encabezado */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Recortar imagen</h2>
            <p className="text-xs text-gray-500">
              Ajustá el encuadre arrastrando las esquinas antes de dividir en hojas
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-1 cursor-pointer leading-none"
            title="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Contenedor del Crop: tamaño dinámico y centrado absoluto */}
        <div
          ref={containerRef}
          className="flex-1 min-h-0 min-w-0 w-full flex items-center justify-center bg-gray-50/80 rounded-lg p-2 my-2 overflow-hidden border border-dashed border-gray-300 relative"
        >
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            style={{
              maxHeight: containerSize.height > 0 ? `${containerSize.height}px` : undefined,
              maxWidth: containerSize.width > 0 ? `${containerSize.width}px` : undefined,
              display: "inline-block",
            }}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              onLoad={onImageLoad}
              alt="Imagen a recortar"
              style={{
                maxHeight: containerSize.height > 0 ? `${containerSize.height}px` : "calc(100dvh - 140px)",
                maxWidth: containerSize.width > 0 ? `${containerSize.width}px` : "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
              className="select-none"
            />
          </ReactCrop>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={!crop?.width || !crop?.height}
            className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Aplicar recorte
          </button>
        </div>
      </div>
    </div>
  );
}

