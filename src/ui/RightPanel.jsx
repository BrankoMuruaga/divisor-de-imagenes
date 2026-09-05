import { useState } from "react";
import MarginControl from "../components/MarginControl";
import LabelsPrintControl from "../components/LabelsPrintControl";
import DpiSelector from "../components/DpiSelector";
import OutputSelector from "../components/OutputSelector";
import CoverPageControl from "../components/CoverPageControl";
import ExportButton from "../components/ExportButton";

export default function RightPanel({
  printerMarginMm,
  onMarginChange,
  showLabels,
  setShowLabels,
  dpi,
  onDpiChange,
  outputFormat,
  onFormatChange,
  imageSrc,
  imageWidth,
  imageHeight,
  finalWidthMm,
  finalHeightMm,
  paperSize,
  orientation,
  overlapMm,
  onChangeImage,
}) {
  const [includeCoverPage, setIncludeCoverPage] = useState(true);

  return (
    <section className="w-full xl:flex-1 xl:max-w-[25%] min-w-0 flex flex-col gap-4 overflow-y-auto max-h-none xl:max-h-screen p-2 scrollbar-none">
      <div className="flex flex-col gap-4">
        <MarginControl
          marginMm={printerMarginMm}
          onMarginChange={onMarginChange}
        />
        <LabelsPrintControl
          showLabels={showLabels}
          setShowLabels={setShowLabels}
        />
        <DpiSelector dpi={dpi} onDpiChange={onDpiChange} />

        <CoverPageControl
          includeCoverPage={includeCoverPage}
          setIncludeCoverPage={setIncludeCoverPage}
          outputFormat={outputFormat}
        />

        <OutputSelector
          outputFormat={outputFormat}
          onFormatChange={onFormatChange}
        />
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <ExportButton
          includeCoverPage={includeCoverPage}
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
            type="button"
            onClick={onChangeImage}
            className="w-full cursor-pointer bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Cambiar imagen
          </button>
        )}
      </div>
    </section>
  );
}
