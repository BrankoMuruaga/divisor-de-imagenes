import { useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { annotate } from "rough-notation";
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from "../constants";
import AddImageIcon from "../icons/AddImageIcon";

export default function ImageUploader({ onImageSelect }) {
  const instructionsRef = useRef(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  useEffect(() => {
    if (!instructionsRef.current) return;
    const annotation = annotate(instructionsRef.current, {
      type: "highlight",
      color: "#facc15",
      padding: 0,
      iterations: 2,
    });
    annotation.show();
    return () => annotation.remove();
  }, []);

  return (
    <section
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors h-5/6 w-full m-8
        ${isDragActive ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-primary-400"}`}
    >
      <input {...getInputProps()} />
      <div className=" flex flex-col gap-2 h-full items-center justify-center w-fit m-auto">
        <AddImageIcon className="size-16 text-gray-400" />

        <p className="text-2xl font-medium text-gray-700">
          {isDragActive
            ? "Soltá la imagen aquí"
            : "Arrastrá y soltá una imagen"}
        </p>
        <p ref={instructionsRef} className="text-md text-gray-500">
          o hacé clic para seleccionar
        </p>
        <p className="text-md text-gray-400">JPG, PNG, WebP (máx. 25 MB)</p>
      </div>
    </section>
  );
}
