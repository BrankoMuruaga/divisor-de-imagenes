import { DEFAULT_OVERLAP, MAX_OVERLAP } from "../constants";
import { fromMm } from "../utils/units";

export default function OverlapControl({ overlapMm, onOverlapChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Superposición: {fromMm(overlapMm, "mm").toFixed(1)} mm
      </label>

      <input
        type="range"
        min="0"
        max={MAX_OVERLAP}
        step="0.5"
        value={overlapMm}
        onChange={(e) => onOverlapChange(parseFloat(e.target.value))}
        className="w-full"
      />

      <div className="flex justify-between text-xs text-gray-500">
        <span>0 mm</span>
        <span>{MAX_OVERLAP} mm</span>
      </div>

      <p className="text-xs text-gray-500">
        Margen de solape entre hojas para facilitar el armado
      </p>
    </div>
  );
}
