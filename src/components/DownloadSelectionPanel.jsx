import { FileText, Image as ImageIcon, FileArchive, X } from "lucide-react";

export default function DownloadSelectionPanel({
  selectedTiles,
  isDownloadingTile,
  onDownload,
  onClearSelection,
}) {
  if (selectedTiles.length === 0) return null;

  return (
    <section className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 border border-gray-200 rounded-2xl p-2.5 sm:p-3 bg-white/95 backdrop-blur-md shadow-2xl flex flex-nowrap items-center justify-between gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 w-[95%] max-w-2xl overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-primary-600 text-white font-bold text-lg">
          {selectedTiles.length}
        </span>
        <div className="flex flex-col">
          <p className="text-lg font-bold text-gray-800 whitespace-nowrap">
            {selectedTiles.length === 1
              ? "Hoja seleccionada"
              : "Hojas seleccionadas"}
          </p>
          <p className="text-sm text-gray-500 hidden md:block whitespace-nowrap">
            Descargá {selectedTiles.length === 1 ? "esta hoja" : "estas hojas"} por separado.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:border-l border-gray-200 sm:pl-4">
        <button
          type="button"
          onClick={() => onDownload("PDF")}
          disabled={isDownloadingTile}
          className="bg-gray-800 hover:bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm whitespace-nowrap"
        >
          <FileText className="w-3.5 h-3.5" />
          PDF
        </button>
        <button
          type="button"
          onClick={() => onDownload("PNG")}
          disabled={isDownloadingTile}
          className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm whitespace-nowrap"
        >
          {selectedTiles.length === 1 ? (
            <ImageIcon className="w-3.5 h-3.5" />
          ) : (
            <FileArchive className="w-3.5 h-3.5" />
          )}
          {selectedTiles.length === 1 ? "PNG" : "ZIP"}
        </button>
        <button
          type="button"
          onClick={onClearSelection}
          className="text-gray-400 hover:text-gray-600 p-1.5 cursor-pointer hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          title="Cerrar selección"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
