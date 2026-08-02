import { useState, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function ImageCropper({ imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 1, width, height),
      width,
      height,
    );
    setCrop(crop);
  }, []);

  const handleCrop = () => {
    if (completedCrop?.width && completedCrop?.height) {
      const image = document.createElement("canvas");
      const scaleX = completedCrop.width / 100;
      const scaleY = completedCrop.height / 100;

      image.width = completedCrop.width;
      image.height = completedCrop.height;

      const ctx = image.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(
          img,
          completedCrop.x,
          completedCrop.y,
          completedCrop.width,
          completedCrop.height,
          0,
          0,
          completedCrop.width,
          completedCrop.height,
        );
        onCropComplete(image.toDataURL("image/png"));
      };
      img.src = imageSrc;
    }
  };

  return (
    <div className="space-y-4">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={undefined}
      >
        <img src={imageSrc} onLoad={onImageLoad} alt="Imagen a recortar" />
      </ReactCrop>
      <button
        onClick={handleCrop}
        disabled={!completedCrop?.width || !completedCrop?.height}
        className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Aplicar recorte
      </button>
    </div>
  );
}
