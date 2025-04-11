import { Player } from "@lottiefiles/react-lottie-player";
import { Modal } from "antd";
import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useUploadPdfMutation } from "../../store/services/pdfApi";
// Configuração do worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PdfUpload = () => {
  const [uploadPdf, { isLoading, isError }] = useUploadPdfMutation();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file) return;

      const formData = new FormData();
      formData.append("pdf", file);

      try {
        const result = await uploadPdf(formData).unwrap();
        const url = URL.createObjectURL(result);
        setPdfUrl(url);
      } catch (error) {
        console.error("Erro ao fazer upload do PDF:", error);
      }
    },
    [uploadPdf]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleBrowseClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full relative px-4">
      <div className="w-full h-[400px] max-w-3xl p-10 bg-white rounded-lg shadow-md border-t-10 border-t-[#42B186]    flex flex-col">
        <h2 className="text-2xl font-normal mb-4 text-center text-gray-600">
          Envie seu PDF
        </h2>

        {isLoading ? (
          <Player
            autoplay
            loop
            src={"/lottie/PDF-loading.json"}
            className=" h-[240px] m-auto"
          />
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg h-3/4 flex flex-col items-center justify-center cursor-pointer my-auto ${
              isDragging ? "border-[#42B186] bg-blue-50" : "border-gray-300"
            } ${isError ? "border-red-500" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <div className="w-16 h-16 bg-[#42B186] rounded-full flex items-center justify-center mb-4">
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
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        )}

        {isError && (
          <div className="mt-1 p-2 text-red-500 rounded-lg">
            Erro ao fazer upload do PDF. Tente novamente.
          </div>
        )}
      </div>

      {pdfUrl && (
        <Modal
          title="PDF Formatado"
          open={!!pdfUrl}
          onCancel={() => setPdfUrl(null)}
          footer={null}
          width={800}
        >
          <div className="mt-4">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center"
            >
              <Page
                pageNumber={pageNumber}
                width={600}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
            {numPages && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                  className="px-4 py-2 bg-[#42B186] text-white rounded-l disabled:bg-gray-300"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 bg-gray-100">
                  Página {pageNumber} de {numPages}
                </span>
                <button
                  onClick={() =>
                    setPageNumber((prev) => Math.min(prev + 1, numPages))
                  }
                  disabled={pageNumber >= numPages}
                  className="px-4 py-2 bg-[#42B186] text-white rounded-r disabled:bg-gray-300"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
