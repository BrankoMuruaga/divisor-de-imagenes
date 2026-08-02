import { DEFAULT_MARGIN, MAX_MARGIN } from "../constants";

export default function MarginControl({ marginMm, onMarginChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Margen no imprimible (Borde blanco)
      </label>

      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max={MAX_MARGIN}
          step="0.5"
          value={marginMm}
          onChange={(e) => onMarginChange(parseFloat(e.target.value))}
          className="flex-1 accent-primary-600"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max={MAX_MARGIN}
            step="0.1"
            value={marginMm}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onMarginChange(val);
            }}
            className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:ring-primary-500 focus:border-primary-500"
          />
          <span className="text-sm text-gray-500 font-medium">mm</span>
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Espacio en blanco obligatorio en los bordes de la hoja de tu impresora.
      </p>
    </div>
  );
}
