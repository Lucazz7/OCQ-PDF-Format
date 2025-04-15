import { Upload } from "lucide-react";

interface UploadFileProps {
  isDragging: boolean;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleBrowseClick: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export default function UploadFile({
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleBrowseClick,
  handleFileChange,
  fileInputRef,
}: UploadFileProps) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg h-3/4 flex flex-col items-center justify-center cursor-pointer my-auto ${
        isDragging ? "border-[#0DA464] bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
    >
      <div className="w-16 h-16 bg-[#0DA464] rounded-full flex items-center justify-center mb-4">
        <Upload className="w-8 h-8 text-white" />
      </div>
      <p className="text-gray-500 text-center">
        Arraste um arquivo PDF aqui
        <br />
        ou clique para selecionar
      </p>
      <input
        type="file"
        accept=".pdf"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
