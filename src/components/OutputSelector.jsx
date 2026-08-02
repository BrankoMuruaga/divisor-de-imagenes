import { OUTPUT_FORMATS } from "../constants";
import WiredRadio from "./WiredRadio";

export default function OutputSelector({ outputFormat, onFormatChange }) {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <label className="block text-sm font-medium text-gray-700">
        Formato de salida
      </label>

      <div className="flex gap-4">
        <label
          className="flex items-center gap-5 cursor-pointer"
          onClick={() => onFormatChange(OUTPUT_FORMATS.PDF)}
        >
          <WiredRadio
            checked={outputFormat === OUTPUT_FORMATS.PDF}
            onChange={onFormatChange}
            name="output"
            value={OUTPUT_FORMATS.PDF}
            size={12}
          />
          <span className="text-sm text-gray-700 translate-y-1.5 select-none">
            PDF
          </span>
        </label>

        <label
          className="flex items-center gap-5 cursor-pointer"
          onClick={() => onFormatChange(OUTPUT_FORMATS.ZIP)}
        >
          <WiredRadio
            checked={outputFormat === OUTPUT_FORMATS.ZIP}
            onChange={onFormatChange}
            name="output"
            value={OUTPUT_FORMATS.ZIP}
            size={12}
          />
          <span className="text-sm text-gray-700 translate-y-1.5 select-none">
            ZIP
          </span>
        </label>
      </div>
    </div>
  );
}
