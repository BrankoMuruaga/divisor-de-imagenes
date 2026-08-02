import { useState, useEffect } from "react";
import { UNITS, DEFAULT_UNIT } from "../constants";
import { toMm, fromMm } from "../utils/units";

export default function SizeControls({
  finalWidthMm,
  finalHeightMm,
  onSizeChange,
  imageAspectRatio,
}) {
  const [dimension, setDimension] = useState("height");
  const [value, setValue] = useState(160);
  const [unit, setUnit] = useState(DEFAULT_UNIT);

  useEffect(() => {
    if (dimension === "height") {
      setValue(fromMm(finalHeightMm, unit));
    } else {
      setValue(fromMm(finalWidthMm, unit));
    }
  }, [finalWidthMm, finalHeightMm, dimension, unit]);

  const handleChange = (newValue) => {
    const numValue = parseFloat(newValue);
    if (isNaN(numValue) || numValue <= 0) return;

    const mmValue = toMm(numValue, unit);

    if (dimension === "height") {
      const width = mmValue * imageAspectRatio;
      onSizeChange(width, mmValue);
    } else {
      const height = mmValue / imageAspectRatio;
      onSizeChange(mmValue, height);
    }
  };

  return (
    <section className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">
        Tamaño final
      </label>

      <div className="flex flex-wrap gap-2">
        <select
          value={dimension}
          onChange={(e) => setDimension(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="height">Alto</option>
          <option value="width">Ancho</option>
        </select>

        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          step="0.1"
          min="0.1"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm w-fit"
        />

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-500">
        {dimension === "height"
          ? `Ancho: ${fromMm(finalWidthMm, unit).toFixed(1)} ${unit}`
          : `Alto: ${fromMm(finalHeightMm, unit).toFixed(1)} ${unit}`}
      </p>
    </section>
  );
}
