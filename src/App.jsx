import { useState, useEffect } from "react";
import ImageCropper from "./components/ImageCropper";
import { LeftPanel, CenterPanel, RightPanel } from "./ui";
import {
  DEFAULT_DPI,
  DEFAULT_MARGIN,
  DEFAULT_OVERLAP,
  OUTPUT_FORMATS,
} from "./constants";

export default function App() {
  const [originalImageSrc, setOriginalImageSrc] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [hasCropped, setHasCropped] = useState(false);

  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const [finalWidthMm, setFinalWidthMm] = useState(1000);
  const [finalHeightMm, setFinalHeightMm] = useState(1600);

  // Cargar preferencias de localStorage si existen
  const [paperSize, setPaperSize] = useState(() => {
    return localStorage.getItem("paper_size") || "A4";
  });
  const [orientation, setOrientation] = useState(() => {
    return localStorage.getItem("paper_orientation") || "portrait";
  });
  const [overlapMm, setOverlapMm] = useState(() => {
    const saved = localStorage.getItem("overlap_mm");
    return saved !== null ? parseFloat(saved) : DEFAULT_OVERLAP;
  });
  const [dpi, setDpi] = useState(() => {
    const saved = localStorage.getItem("printer_dpi");
    return saved !== null ? parseInt(saved, 10) : DEFAULT_DPI;
  });
  const [outputFormat, setOutputFormat] = useState(OUTPUT_FORMATS.PDF);
  const [showLabels, setShowLabels] = useState(true);
  const [printerMarginMm, setPrinterMarginMm] = useState(() => {
    const saved = localStorage.getItem("printer_margin_mm");
    return saved !== null ? parseFloat(saved) : DEFAULT_MARGIN;
  });

  // Guardar preferencias en localStorage
  useEffect(() => {
    localStorage.setItem("paper_size", paperSize);
  }, [paperSize]);

  useEffect(() => {
    localStorage.setItem("paper_orientation", orientation);
  }, [orientation]);

  useEffect(() => {
    localStorage.setItem("overlap_mm", overlapMm.toString());
  }, [overlapMm]);

  useEffect(() => {
    localStorage.setItem("printer_dpi", dpi.toString());
  }, [dpi]);

  useEffect(() => {
    localStorage.setItem("printer_margin_mm", printerMarginMm.toString());
  }, [printerMarginMm]);

  const handleImageSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);

        const aspectRatio = img.width / img.height;
        setFinalWidthMm(finalHeightMm * aspectRatio);

        setOriginalImageSrc(dataUrl);
        setImageSrc(dataUrl);
        setHasCropped(false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedDataUrl, cropW, cropH) => {
    setImageSrc(croppedDataUrl);
    setImageWidth(cropW);
    setImageHeight(cropH);
    const aspectRatio = cropW / cropH;
    setFinalWidthMm(finalHeightMm * aspectRatio);
    setHasCropped(true);
    setIsCropperOpen(false);
  };

  const handleResetCrop = () => {
    if (!originalImageSrc) return;
    const img = new Image();
    img.onload = () => {
      setImageWidth(img.width);
      setImageHeight(img.height);
      const aspectRatio = img.width / img.height;
      setFinalWidthMm(finalHeightMm * aspectRatio);
      setImageSrc(originalImageSrc);
      setHasCropped(false);
    };
    img.src = originalImageSrc;
  };

  const handleSizeChange = (width, height) => {
    setFinalWidthMm(width);
    setFinalHeightMm(height);
  };

  const imageAspectRatio = imageWidth / (imageHeight || 1);

  return (
    <>
      {/* Background grid */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[#fcfcf9] bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:16px_24px]"></div>

      {/* Modal de recorte de imagen */}
      <ImageCropper
        isOpen={isCropperOpen}
        imageSrc={originalImageSrc}
        onCropComplete={handleCropComplete}
        onCancel={() => setIsCropperOpen(false)}
      />

      <main className="min-h-screen xl:h-screen w-full p-4 xl:p-6 flex flex-col xl:flex-row gap-6 overflow-x-hidden xl:overflow-hidden font-doodle">
        {/* Panel izquierdo */}
        <LeftPanel
          finalWidthMm={finalWidthMm}
          finalHeightMm={finalHeightMm}
          onSizeChange={handleSizeChange}
          imageAspectRatio={imageAspectRatio}
          paperSize={paperSize}
          orientation={orientation}
          onPaperChange={setPaperSize}
          onOrientationChange={setOrientation}
          overlapMm={overlapMm}
          onOverlapChange={setOverlapMm}
        />

        {/* Panel central */}
        <CenterPanel
          imageSrc={imageSrc}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          finalWidthMm={finalWidthMm}
          finalHeightMm={finalHeightMm}
          paperSize={paperSize}
          orientation={orientation}
          overlapMm={overlapMm}
          dpi={dpi}
          printerMarginMm={printerMarginMm}
          showLabels={showLabels}
          hasCropped={hasCropped}
          onImageSelect={handleImageSelect}
          onOpenCropper={() => setIsCropperOpen(true)}
          onResetCrop={handleResetCrop}
        />

        {/* Panel derecho */}
        <RightPanel
          printerMarginMm={printerMarginMm}
          onMarginChange={setPrinterMarginMm}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          dpi={dpi}
          onDpiChange={setDpi}
          outputFormat={outputFormat}
          onFormatChange={setOutputFormat}
          imageSrc={imageSrc}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          finalWidthMm={finalWidthMm}
          finalHeightMm={finalHeightMm}
          paperSize={paperSize}
          orientation={orientation}
          overlapMm={overlapMm}
          onChangeImage={() => {
            setImageSrc(null);
            setOriginalImageSrc(null);
            setHasCropped(false);
          }}
        />
      </main>
    </>
  );
}


