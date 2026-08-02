import { PAPER_SIZES } from "../utils/paperSizes";
import Button from "./Button";

export default function PaperControls({
  paperSize,
  orientation,
  onPaperChange,
  onOrientationChange,
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Tamaño de papel
      </label>

      <div className="grid grid-cols-3 gap-2">
        {Object.entries(PAPER_SIZES).map(([key, paper]) => (
          <Button
            onClick={() => onPaperChange(key)}
            active={paperSize === key}
            key={key}
          >
            {paper.label}
          </Button>
        ))}
      </div>

      <label className="block text-sm font-medium text-gray-700 mt-4">
        Orientación
      </label>

      <div className="flex gap-2">
        <Button
          onClick={() => onOrientationChange("portrait")}
          className="flex-1"
          active={orientation === "portrait"}
        >
          Vertical
        </Button>

        <Button
          onClick={() => onOrientationChange("landscape")}
          className="flex-1"
          active={orientation === "landscape"}
        >
          Horizontal
        </Button>
      </div>
    </div>
  );
}
