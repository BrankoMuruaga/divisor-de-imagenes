import SizeControls from "../components/SizeControls";
import PaperControls from "../components/PaperControls";
import OverlapControl from "../components/OverlapControl";

export default function LeftPanel({
  finalWidthMm,
  finalHeightMm,
  onSizeChange,
  imageAspectRatio,
  paperSize,
  orientation,
  onPaperChange,
  onOrientationChange,
  overlapMm,
  onOverlapChange,
}) {
  return (
    <section className="w-full xl:flex-1 xl:max-w-[25%] min-w-0 flex flex-col gap-3 overflow-y-auto max-h-none xl:max-h-screen p-2 scrollbar-none">
      <SizeControls
        finalWidthMm={finalWidthMm}
        finalHeightMm={finalHeightMm}
        onSizeChange={onSizeChange}
        imageAspectRatio={imageAspectRatio}
      />

      <PaperControls
        paperSize={paperSize}
        orientation={orientation}
        onPaperChange={onPaperChange}
        onOrientationChange={onOrientationChange}
      />

      <OverlapControl
        overlapMm={overlapMm}
        onOverlapChange={onOverlapChange}
      />
    </section>
  );
}
