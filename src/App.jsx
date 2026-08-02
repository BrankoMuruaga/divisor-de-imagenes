import { useState, useCallback } from "react";
import ImageUploader from "./components/ImageUploader";
import ImageCropper from "./components/ImageCropper";
import SizeControls from "./components/SizeControls";
import PaperControls from "./components/PaperControls";
import OverlapControl from "./components/OverlapControl";
import DpiSelector from "./components/DpiSelector";
import OutputSelector from "./components/OutputSelector";
import Preview from "./components/Preview";
import ExportButton from "./components/ExportButton";
import MarginControl from "./components/MarginControl";
import {
  DEFAULT_DPI,
  DEFAULT_OVERLAP,
  OUTPUT_FORMATS,
  DEFAULT_MARGIN,
} from "./constants";
import { toMm } from "./utils/units";
import LabelsPrintControl from "./components/LabelsPrintControl";

export default function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImageSrc, setCroppedImageSrc] = useState(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const [finalWidthMm, setFinalWidthMm] = useState(1000);
  const [finalHeightMm, setFinalHeightMm] = useState(1600);

  const [paperSize, setPaperSize] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");
  const [overlapMm, setOverlapMm] = useState(DEFAULT_OVERLAP);
  const [dpi, setDpi] = useState(DEFAULT_DPI);
  const [outputFormat, setOutputFormat] = useState(OUTPUT_FORMATS.PDF);

  const [showLabels, setShowLabels] = useState(true);

  const [printerMarginMm, setPrinterMarginMm] = useState(DEFAULT_MARGIN);

  const handleImageSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);

        const aspectRatio = img.width / img.height;
        setFinalWidthMm(finalHeightMm * aspectRatio);

        setImageSrc(e.target.result);
        setCroppedImageSrc(null);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSizeChange = (width, height) => {
    setFinalWidthMm(width);
    setFinalHeightMm(height);
  };

  const imageAspectRatio = imageWidth / imageHeight;

  return (
    <>
      {/* Background grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <main className="min-h-screen w-full  flex gap-8 font-doodle">
        {/* Columna izquierda: configuración de imagen y hojas */}
        <section className="w-1/4 flex flex-col gap-2 h-screen overflow-auto overflow-x-hidden p-6 scrollbar-none">
          <SizeControls
            finalWidthMm={finalWidthMm}
            finalHeightMm={finalHeightMm}
            onSizeChange={handleSizeChange}
            imageAspectRatio={imageAspectRatio}
          />

          <PaperControls
            paperSize={paperSize}
            orientation={orientation}
            onPaperChange={setPaperSize}
            onOrientationChange={setOrientation}
          />

          <OverlapControl
            overlapMm={overlapMm}
            onOverlapChange={setOverlapMm}
          />
        </section>

        {/* Columna del medio: imagen */}
        <section className="w-1/2 flex justify-center max-h-screen">
          {!imageSrc ? (
            <ImageUploader onImageSelect={handleImageSelect} />
          ) : (
            <div className="flex flex-col gap-3 rounded-lg p-6 w-fit h-fit m-auto">
              <Preview
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
              />
            </div>
          )}
        </section>

        {/* Columna derecha: descarga */}
        <section className="w-1/4 flex flex-col gap-3 h-screen p-6">
          <div className="flex flex-col gap-5 overflow-auto">
            <MarginControl
              marginMm={printerMarginMm}
              onMarginChange={setPrinterMarginMm}
            />
            <LabelsPrintControl
              showLabels={showLabels}
              setShowLabels={setShowLabels}
            />
            <DpiSelector dpi={dpi} onDpiChange={setDpi} />

            <OutputSelector
              outputFormat={outputFormat}
              onFormatChange={setOutputFormat}
            />
          </div>

          <ExportButton
            imageSrc={imageSrc}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            finalWidthMm={finalWidthMm}
            finalHeightMm={finalHeightMm}
            paperSize={paperSize}
            orientation={orientation}
            overlapMm={overlapMm}
            dpi={dpi}
            outputFormat={outputFormat}
            printerMarginMm={printerMarginMm}
            showLabels={showLabels}
          />

          {imageSrc && (
            <button
              onClick={() => {
                setImageSrc(null);
              }}
              className="w-full cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Cambiar imagen
            </button>
          )}
        </section>
      </main>
    </>
  );
}
