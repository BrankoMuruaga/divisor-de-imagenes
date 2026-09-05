import WiredCheckbox from "./WiredCheckbox";
import { OUTPUT_FORMATS } from "../constants";

export default function CoverPageControl({
  includeCoverPage,
  setIncludeCoverPage,
  outputFormat,
}) {
  return (
    <div>
      <label
        onClick={(e) => {
          e.preventDefault();
          setIncludeCoverPage(!includeCoverPage);
        }}
        className="flex items-center gap-4 cursor-pointer text-sm font-medium text-gray-700 select-none"
      >
        <WiredCheckbox
          checked={includeCoverPage}
          onChange={setIncludeCoverPage}
          size={16}
        />
        <span className="translate-y-[2px]">
          Incluir portada guía ({outputFormat === OUTPUT_FORMATS.PDF ? "Pág 1" : "PNG"})
        </span>
      </label>
    </div>
  );
}
