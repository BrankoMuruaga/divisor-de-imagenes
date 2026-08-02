import { DPI_OPTIONS, DEFAULT_DPI } from "../constants";
import Button from "./Button";

export default function DpiSelector({ dpi, onDpiChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">
        DPI (calidad de impresión)
      </label>

      <div className="grid grid-cols-4 gap-2">
        {DPI_OPTIONS.map((d) => (
          <Button key={d} onClick={() => onDpiChange(d)} active={dpi === d}>
            {d}
          </Button>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        {dpi <= 150 && "Bueno para pósters vistos de lejos"}
        {dpi === 300 && "Calidad fotográfica estándar"}
        {dpi >= 600 && "Alta calidad (archivos más grandes)"}
      </p>
    </div>
  );
}
