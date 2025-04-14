/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Player } from "@lottiefiles/react-lottie-player";
import { Trash2, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { LaudoAnalise } from "../../components/LaudoAnalise";
import { ILaudoAnnalistic } from "../../interface/ILaudoAnnalistic";
import { useUploadPdfMutation } from "../../store/services/pdfApi";

interface PdfAnalise {
  file: File;
  analise: ILaudoAnnalistic;
}

export const PdfUpload = () => {
  const [uploadPdf, { isLoading, isError, reset }] = useUploadPdfMutation();
  const [pdfAnalises, setPdfAnalises] = useState<PdfAnalise[]>([]);
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
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadPdf(formData).unwrap();

        setPdfAnalises((prev) => [
          ...prev,
          {
            file: file,
            analise: response,
          },
        ]);
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

  return (
    <div className="w-full flex h-full relative px-4">
      <div className="absolute inset-0 bg-[#42B186] [clip-path:polygon(100%_100%,0%_100%,100%_0%)] z-0" />

      {pdfAnalises.length > 0 ? (
        <>
          {!viewMode ? (
            <div className="m-auto w-full max-w-md p-7 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] z-10">
              <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
                Arquivos Analisados
              </h2>
              <div className="flex flex-col gap-4">
                <Swiper
                  breakpoints={{
                    375: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    400: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    720: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                  }}
                  spaceBetween={30}
                  className="w-full h-full relative cursor-grab active:cursor-grabbing"
                  centeredSlides={pdfAnalises.length <= 1}
                >
                  {pdfAnalises.map((file, index) => (
                    <SwiperSlide key={index}>
                      <div className="w-full flex flex-col items-center gap-2">
                        <div className="min-w-44 h-full flex items-center bg-white p-2 py-6 shadow-xl justify-center rounded-lg relative">
                          <img
                            src="/pdf-OCQ.svg"
                            alt="PDF"
                            className="w-full object-contain h-[150px]"
                          />
                          <button
                            onClick={() => {
                              removeFile(index);
                            }}
                            className="absolute top-2 -right-4 rounded-full p-2 bg-gray-50 shadow-md cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                        <div
                          key={index}
                          className="w-full flex items-center flex-col justify-between p-2 bg-gray-50 rounded gap-2"
                        >
                          <span className="text-sm text-gray-500 truncate">
                            {file.file.name}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedFileIndex(index);
                                setViewMode("single");
                              }}
                              className="px-4 py-[5px] bg-[#0DA464] text-white text-sm rounded font-semibold"
                            >
                              Visualizar
                            </button>
                            <button
                              onClick={() => {
                                setSelectedFileIndex(index);
                                setViewMode("compare");
                              }}
                              className="px-4 py-[5px] bg-blue-500 text-white text-sm rounded font-semibold"
                            >
                              Comparar
                            </button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ) : (
            <div className="m-auto w-full h-9/12 md:h-10/12 overflow-y-auto max-w-full p-10 z-10 flex gap-4">
              {viewMode === "single" ? (
                <div className="w-9/12 flex-1 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] p-6 overflow-auto relative">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Análise do PDF
                  </h3>
                  <LaudoAnalise {...pdfAnalises[selectedFileIndex!].analise} />
                </div>
              ) : (
                selectedFileIndex !== null && (
                  <>
                    <div className="flex-1 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] h-full">
                      <embed
                        src={URL.createObjectURL(
                          pdfAnalises[selectedFileIndex].file
                        )}
                        type="application/pdf"
                        className="w-full h-full overflow-auto"
                      />
                    </div>

                    <div className="flex-1 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] p-6 overflow-auto relative">
                      <h3 className="text-lg font-semibold mb-4 text-center">
                        Análise do PDF
                      </h3>
                      <LaudoAnalise
                        {...pdfAnalises[selectedFileIndex].analise}
                      />
                    </div>
                  </>
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
                  })()
            }
            className="absolute top-4 right-8 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors z-20"
          >
            Voltar
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
            <div
              className="w-full h-full relative"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <Swiper
                breakpoints={{
                  375: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  400: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  720: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                }}
                spaceBetween={30}
                className="w-full h-full relative cursor-grab active:cursor-grabbing"
                centeredSlides={selectedFiles.length <= 1}
              >
                {selectedFiles.map((file, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full h-[270px] flex flex-col items-center justify-center gap-2">
                      <div className="h-full flex items-center bg-white p-2 py-6 shadow-xl justify-center rounded-lg relative">
                        <img
                          src="/pdf-OCQ.svg"
                          alt="PDF"
                          className="w-full object-contain h-[150px]"
                        />
                        <button
                          onClick={() => {
                            removeFile(index);
                          }}
                          className="absolute top-2 -right-4 rounded-full p-2 bg-gray-50 shadow-md cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500 max-w-[200px] truncate">
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-500 truncate">
                            {file.name}
                          </span>
                        </div>
                      </span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
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
                onClick={() =>
                  selectedFiles.forEach((file) => handleUpload(file))
                }
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
