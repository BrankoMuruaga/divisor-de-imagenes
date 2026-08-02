import React from "react";
import WiredCheckbox from "./WiredCheckbox";

const LabelsPrintControl = ({ showLabels, setShowLabels }) => {
  const handleLabelClick = (e) => {
    e.preventDefault();
    setShowLabels(!showLabels);
  };

  return (
    <section className="">
      <label
        onClick={handleLabelClick}
        className="flex items-center gap-5 cursor-pointer"
      >
        <WiredCheckbox
          checked={showLabels}
          onChange={setShowLabels}
          size={12}
        />
        <span className="text-sm text-gray-700 font-medium text-center translate-y-1.5 select-none">
          Imprimir etiquetas de posición
        </span>
      </label>
    </section>
  );
};

export default LabelsPrintControl;
