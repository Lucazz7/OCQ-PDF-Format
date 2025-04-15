/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Player } from "@lottiefiles/react-lottie-player";
import { ArrowLeft } from "lucide-react";
import { useCallback, useRef, useState } from "react";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { LaudoAnalise } from "../../components/LaudoAnalise";
import SwiperPDFAnalises from "../../components/swipers/SwiperPDFAnalises";
import SwiperSelectFiles from "../../components/swipers/SwiperSelectFiles";
import UploadFile from "../../components/UploadFile";
import { ILaudoAnnalistic } from "../../interface/ILaudoAnnalistic";
import { useUploadPdfMutation } from "../../store/services/pdfApi";

export interface PdfAnalise {
  file: File;
  analise: ILaudoAnnalistic;
  status: "loading" | "success" | "error";
}

interface PdfPreview {
  id: number;
  url: string;
}

export const PdfUpload = () => {
  const [uploadPdf, { isLoading, isError, reset }] = useUploadPdfMutation();
  const [pdfAnalises, setPdfAnalises] = useState<PdfAnalise[]>([]);
  const [pdfPreviews, setPdfPreviews] = useState<PdfPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [viewMode, setViewMode] = useState<"single" | "compare" | null>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null
  );
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
    (files: File[]) => {
      if (files.length === 0) return;
      const newFiles = files.slice(0, 5 - selectedFiles.length);
      setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
    },
    [selectedFiles]
  );

  const handleUpload = useCallback(
    async (files: File[]) => {
      // Inicializa o estado com todos os arquivos em loading
      setPdfAnalises(
        files.map((file) => ({
          file,
          analise: {} as ILaudoAnnalistic,
          status: "loading",
        }))
      );

      // Criar previews para todos os arquivos
      const newPreviews = files.map((file, index) => ({
        id: index,
        url: URL.createObjectURL(file),
      }));
      setPdfPreviews(newPreviews);

      // Processa cada arquivo sequencialmente
      for (let i = 0; i < files.length; i++) {
        try {
          const formData = new FormData();
          formData.append("file", files[i]);
          const response = await uploadPdf(formData).unwrap();

          setPdfAnalises((prev) => {
            const newAnalises = [...prev];
            newAnalises[i] = {
              file: files[i],
              analise: response,
              status: "success",
            };
            return newAnalises;
          });
        } catch (error) {
          console.error("Erro ao fazer upload do PDF:", error);
          setPdfAnalises((prev) => {
            const newAnalises = [...prev];
            newAnalises[i] = {
              file: files[i],
              analise: {} as ILaudoAnnalistic,
              status: "error",
            };
            return newAnalises;
          });
        }
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
        const files = Array.from(e.dataTransfer.files).filter(
          (file) => file.type === "application/pdf"
        );
        handleFileSelect(files);
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
    const files = event.target.files ? Array.from(event.target.files) : [];
    handleFileSelect(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    reset();
  };

  const handleRetryUpload = useCallback(
    async (file: File, index: number) => {
      try {
        setPdfAnalises((prev) => {
          const newAnalises = [...prev];
          newAnalises[index] = {
            file,
            analise: {} as ILaudoAnnalistic,
            status: "loading",
          };
          return newAnalises;
        });

        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadPdf(formData).unwrap();

        setPdfAnalises((prev) => {
          const newAnalises = [...prev];
          newAnalises[index] = {
            file,
            analise: response,
            status: "success",
          };
          return newAnalises;
        });
      } catch (error) {
        console.error("Erro ao fazer upload do PDF:", error);
        setPdfAnalises((prev) => {
          const newAnalises = [...prev];
          newAnalises[index] = {
            file,
            analise: {} as ILaudoAnnalistic,
            status: "error",
          };
          return newAnalises;
        });
      }
    },
    [uploadPdf]
  );

  const handleAddColl = useCallback(() => {
    setPdfAnalises((prev) => {
      const findPdfSelect = prev
        .find((_, index) => index === selectedFileIndex)
        ?.analise.componentes.concat({
          maximo: "",
          minimo: "",
          nome: "",
          observacao: "",
          valor: "",
        });
      if (findPdfSelect) {
        return prev.map((pdf, index) =>
          index === selectedFileIndex
            ? {
                ...pdf,
                analise: { ...pdf.analise, componentes: findPdfSelect },
              }
            : pdf
        );
      }
      return prev;
    });
  }, [selectedFileIndex]);

  const handleRemoveColl = useCallback(
    (indexToRemove: number) => {
      setPdfAnalises((prev) => {
        const findPdfSelect = prev
          .find((_, index) => index === selectedFileIndex)
          ?.analise.componentes.filter((_, index) => index !== indexToRemove);

        if (findPdfSelect) {
          return prev.map((pdf, index) =>
            index === selectedFileIndex
              ? {
                  ...pdf,
                  analise: { ...pdf.analise, componentes: findPdfSelect },
                }
              : pdf
          );
        }
        return prev;
      });
    },
    [selectedFileIndex]
  );

  const handleReorderColl = useCallback(
    (newOrder: any[]) => {
      if (selectedFileIndex === null) return;
      setPdfAnalises((prev) => {
        // Se não houver mudanças reais, retorna o estado anterior
        if (prev[selectedFileIndex]?.analise?.componentes === newOrder) {
          return prev;
        }

        // Cria uma cópia do array apenas se necessário
        const newPdfAnalises = [...prev];
        newPdfAnalises[selectedFileIndex] = {
          ...newPdfAnalises[selectedFileIndex],
          analise: {
            ...newPdfAnalises[selectedFileIndex].analise,
            componentes: newOrder,
          },
        };

        return newPdfAnalises;
      });
    },
    [selectedFileIndex]
  );

  // Função para limpar os previews quando necessário
  const clearPreviews = useCallback(() => {
    pdfPreviews.forEach((preview) => {
      URL.revokeObjectURL(preview.url);
    });
    setPdfPreviews([]);
  }, [pdfPreviews]);

  return (
    <div className="w-full flex h-full relative px-4 py-6 md:py-0">
      <div className="absolute inset-0 bg-[#42B186] [clip-path:polygon(100%_100%,0%_100%,100%_0%)] z-0" />

      {pdfAnalises.length > 0 ? (
        <>
          {!viewMode ? (
            <div className="m-auto w-full md:h-[420px] max-w-3xl p-2 md:p-7 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] z-10 flex flex-col ">
              <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
                {isLoading
                  ? `Convertendo PDFs... (${
                      pdfAnalises.filter((pdf) => pdf.status === "success")
                        .length
                    }/${pdfAnalises.length})`
                  : `Arquivos formatados (${
                      pdfAnalises.filter((pdf) => pdf.status === "success")
                        .length
                    }/${pdfAnalises.length})`}
              </h2>
              <SwiperPDFAnalises
                pdfAnalises={pdfAnalises}
                setPdfAnalises={setPdfAnalises}
                setSelectedFileIndex={setSelectedFileIndex}
                setViewMode={setViewMode}
                handleRetryUpload={handleRetryUpload}
              />
            </div>
          ) : (
            <div className="m-auto w-full h-full md:h-11/12 md:overflow-hidden max-w-full px-4 md:px-10 z-10 flex gap-6 ">
              {viewMode === "single" ? (
                <div className="m-auto max-w-[1024px] h-full flex-1 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] relative overflow-auto p-6">
                  <LaudoAnalise
                    data={pdfAnalises[selectedFileIndex!].analise}
                    handleAddColl={handleAddColl}
                    handleRemoveColl={handleRemoveColl}
                    handleReorderComponents={handleReorderColl}
                  />
                </div>
              ) : (
                selectedFileIndex !== null && (
                  <div className="w-full h-full flex flex-col lg:flex-row gap-8 pt-24 md:mt-0">
                    <div className="flex-1 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] h-full overflow-auto flex items-center justify-center">
                      {selectedFileIndex !== null &&
                        pdfPreviews[selectedFileIndex] && (
                          <iframe
                            src={pdfPreviews[selectedFileIndex].url}
                            className="w-full h-full object-contain"
                            title="Visualização do PDF"
                          />
                        )}
                    </div>

                    <div className="flex-1 h-96 md:h-full bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] p-6 overflow-auto relative">
                      <LaudoAnalise
                        data={pdfAnalises[selectedFileIndex].analise}
                        handleAddColl={handleAddColl}
                        handleRemoveColl={handleRemoveColl}
                        handleReorderComponents={handleReorderColl}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <button
            onClick={() =>
              viewMode !== null
                ? setViewMode(null)
                : (() => {
                    setSelectedFiles([]);
                    setPdfAnalises([]);
                    clearPreviews();
                  })()
            }
            className="absolute top-4 right-8 p-2 bg-white text-[#0DA464] rounded-full border shadow-xl transition-colors z-20 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
        </>
      ) : (
        <div className="m-auto w-full h-[410px] max-w-3xl p-7 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] z-10 flex flex-col relative">
          <h2 className="text-xl sm:text-2xl font-normal mb-4 text-center text-gray-600">
            {isLoading
              ? "Convertendo PDFs..."
              : `Envie seus PDFs (máximo ${
                  selectedFiles.length ? `${selectedFiles.length}/5` : 5
                })`}
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className=" flex items-center bg-white p-2 py-6 shadow-xl justify-center rounded-lg relative">
                <Player
                  autoplay
                  loop
                  src={"/lottie/PDF-loading.json"}
                  className=" h-[220px] pe-4"
                />
              </div>
            </div>
          ) : selectedFiles.length > 0 ? (
            <SwiperSelectFiles
              selectedFiles={selectedFiles}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleBrowseClick={handleBrowseClick}
              removeFile={removeFile}
            />
          ) : (
            <UploadFile
              isDragging={isDragging}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleBrowseClick={handleBrowseClick}
              handleFileChange={handleFileChange}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
            />
          )}
          {isError && selectedFiles.length > 0 && (
            <div className="text-center text-red-500 rounded-lg mx-auto text-sm">
              Erro ao fazer upload do{" "}
              {selectedFiles.length > 1 ? "PDFs" : "PDF"}. Tente novamente.
            </div>
          )}

          {selectedFiles.length > 0 && !isLoading && (
            <div className="mt-7 flex flex-col items-center absolute -bottom-5 left-0 right-0">
              <button
                onClick={() => handleUpload(selectedFiles)}
                className="px-8 py-2 bg-[#0DA464] text-white rounded-full hover:bg-[#3a9d77] transition-colors cursor-pointer"
              >
                Enviar PDFs
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
