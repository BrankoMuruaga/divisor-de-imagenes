import ImageUploader from "../components/ImageUploader";
import Preview from "../components/Preview";

export default function CenterPanel({
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
  showLabels,
  hasCropped,
  onImageSelect,
  onOpenCropper,
  onResetCrop,
}) {
  return (
    <section className="w-full xl:flex-[3] xl:max-w-[50%] min-w-0 h-full flex flex-col items-center justify-center min-h-[500px] xl:min-h-0">
      {!imageSrc ? (
        <div className="w-full h-full flex items-center justify-center">
          <ImageUploader onImageSelect={onImageSelect} />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col flex-1 min-h-0">
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
            showLabels={showLabels}
            onOpenCropper={onOpenCropper}
            hasCropped={hasCropped}
            onResetCrop={onResetCrop}
          />
        </div>
      )}
    </section>
  );
}
