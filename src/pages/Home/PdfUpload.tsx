import { Player } from "@lottiefiles/react-lottie-player";
import { Trash2, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { LaudoAnalise } from "../../components/LaudoAnalise";
import { useUploadPdfMutation } from "../../store/services/pdfApi";

// const laudoData: LaudoAnaliseProps = {
//   produto: "Produto Teste",
//   lote: "17013001",
//   quantidade: "100 unidades",
//   data_fabricacao: "01/01/2024",
//   data_validade: "01/01/2025",
//   nota_fiscal: "1234567890",
//   elaborado_por: "João da Silva",
//   data_elaboracao: "01/01/2024",
//   componentes: [
//     {
//       nome: "Análise 1",
//       minimo: "10",
//       maximo: "20",
//       valor: "15",
//       observacao: "OK",
//     },
//     {
//       nome: "Análise 2",
//       minimo: "10",
//       maximo: "20",
//       valor: "15",
//       observacao: "OK",
//     },
//   ],
// };

export const PdfUpload = () => {
  const [uploadPdf, { data: laudoData, isLoading, isError, reset }] =
    useUploadPdfMutation();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;
    setSelectedFile(file);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      await uploadPdf(formData).unwrap();
    } catch (error) {
      console.error("Erro ao fazer upload do PDF:", error);
    }
  }, [selectedFile, uploadPdf]);

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

  return (
    <div className="w-full flex h-full relative px-4">
      <div className="absolute inset-0 bg-[#42B186] [clip-path:polygon(100%_100%,0%_100%,100%_0%)] z-0" />

      {laudoData ? (
        <div className="m-auto w-full md:h-11/12 overflow-auto max-w-6xl p-10 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] z-10 flex flex-col relative">
          <LaudoAnalise
            produto={laudoData.produto}
            lote={laudoData.lote}
            quantidade={laudoData.quantidade}
            data_fabricacao={laudoData.data_fabricacao}
            data_validade={laudoData.data_validade}
            nota_fiscal={laudoData.nota_fiscal}
            elaborado_por={laudoData.elaborado_por}
            data_elaboracao={laudoData.data_elaboracao}
            componentes={laudoData.componentes}
          />
        </div>
      ) : (
        <div className="m-auto w-full h-[400px] max-w-3xl p-7 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] z-10 flex flex-col relative">
          <h2 className="text-2xl font-normal mb-4 text-center text-gray-600">
            Envie seu PDF
          </h2>

          {isLoading ? (
            <Player
              autoplay
              loop
              src={"/lottie/PDF-loading.json"}
              className=" h-[220px] pe-4"
            />
          ) : selectedFile ? (
            <div className="mt-4 flex flex-col items-center h-full w-full">
              <div className="flex flex-col items-center gap-2">
                <div className="h-full w-full flex items-center bg-white p-2 py-6 shadow-xl justify-center rounded-lg relative">
                  <img
                    src="/pdf-OCQ.svg"
                    alt="PDF"
                    className="object-contain h-[150px]"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      reset();
                    }}
                    className="absolute -top-4 -right-4 rounded-full p-2 bg-gray-50 shadow-md cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
                <span className="text-sm text-gray-500 max-w-[200px] truncate">
                  {selectedFile.name}
                </span>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg h-3/4 flex flex-col items-center justify-center cursor-pointer my-auto ${
                isDragging ? "border-[#0DA464] bg-blue-50" : "border-gray-300"
              } ${isError ? "border-red-500" : ""}`}
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
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          )}

          {selectedFile && !isLoading && (
            <div className="mt-4 flex flex-col items-center">
              <button
                onClick={handleUpload}
                className="px-8 py-2 bg-[#0DA464] text-white rounded-full hover:bg-[#3a9d77] transition-colors absolute -bottom-5 font-semibold cursor-pointer"
              >
                Enviar PDF
              </button>
            </div>
          )}

          {isError && (
            <div className="pb-1 text-red-500 rounded-lg mx-auto text-sm">
              Erro ao fazer upload do PDF. Tente novamente.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
