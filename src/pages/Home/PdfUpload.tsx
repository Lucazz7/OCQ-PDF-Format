/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Player } from "@lottiefiles/react-lottie-player";
import { ArrowLeft, Trash2, Upload } from "lucide-react";
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
  status: "loading" | "success" | "error";
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
    async (files: File[]) => {
      // Inicializa o estado com todos os arquivos em loading
      setPdfAnalises(
        files.map((file) => ({
          file,
          analise: {} as ILaudoAnnalistic,
          status: "loading",
        }))
      );

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
              <div className="w-full flex h-full">
                <Swiper
                  breakpoints={{
                    375: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    520: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    620: {
                      slidesPerView: 2,
                      spaceBetween: 20,
                    },
                    720: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 20,
                    },
                  }}
                  spaceBetween={30}
                  centeredSlides={pdfAnalises.length <= 1}
                  className="w-full my-auto relative cursor-grab active:cursor-grabbing"
                >
                  {pdfAnalises.map((file, index) => (
                    <SwiperSlide key={index} className="w-full">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div
                          className={`w-44 h-full flex items-center bg-white p-2 py-6 shadow-xl justify-center rounded-lg relative transition-all duration-300 ${
                            file.status === "error"
                              ? "border-2 border-red-500"
                              : file.status === "loading"
                              ? "border-2 border-blue-500"
                              : "border-2 border-green-500"
                          }`}
                        >
                          {file.status === "loading" ? (
                            <Player
                              autoplay
                              loop
                              src={"/lottie/PDF-loading.json"}
                              className="h-[150px]"
                            />
                          ) : (
                            <img
                              src="/pdf-OCQ.svg"
                              alt="PDF"
                              className="w-full object-contain h-[150px]"
                            />
                          )}
                          {(file.status === "success" ||
                            file.status === "error") && (
                            <button
                              onClick={() => {
                                setPdfAnalises((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                              className="absolute top-2 -right-4 rounded-full p-2 bg-gray-50 shadow-md cursor-pointer"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          )}
                        </div>
                        <div
                          key={index}
                          className="w-full flex items-center flex-col justify-between p-2 rounded gap-2"
                        >
                          <span className="text-sm text-gray-500 truncate max-w-[100px]">
                            {file.file.name}
                          </span>
                          {file.status === "success" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedFileIndex(index);
                                  setViewMode("single");
                                }}
                                className="px-4 py-[5px] bg-[#0DA464] text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#0DA464]/80 transition-colors"
                              >
                                Visualizar
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedFileIndex(index);
                                  setViewMode("compare");
                                }}
                                className="px-4 py-[5px] bg-blue-500 text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-blue-500/80 transition-colors"
                              >
                                Comparar
                              </button>
                            </div>
                          )}
                          {file.status === "error" && (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-red-500 text-sm">
                                Erro ao carregar o PDF
                              </span>
                              <button
                                onClick={() =>
                                  handleRetryUpload(file.file, index)
                                }
                                className="px-3 py-1 bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors rounded-lg cursor-pointer"
                              >
                                Tentar Novamente
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ) : (
            <div className="m-auto w-full h-full md:h-11/12 md:overflow-hidden max-w-full px-4 md:px-10 z-10 flex gap-6 ">
              {viewMode === "single" ? (
                <div className="m-auto max-w-[1024px] h-full flex-1 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] relative overflow-auto p-6">
                  <LaudoAnalise
                    data={pdfAnalises[selectedFileIndex!].analise}
                    handleAddColl={handleAddColl}
                    handleRemoveColl={handleRemoveColl}
                  />
                </div>
              ) : (
                selectedFileIndex !== null && (
                  <div className="w-full h-full flex flex-col lg:flex-row gap-8 pt-24 md:mt-0">
                    <div className="flex-1 bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] h-full overflow-auto flex items-center justify-center">
                      <iframe
                        src={URL.createObjectURL(
                          pdfAnalises[selectedFileIndex].file
                        )}
                        className="w-full  h-full object-contain"
                        title="Visualização do PDF"
                      />
                    </div>

                    <div className="flex-1 h-96 md:h-full bg-white rounded-lg shadow-md border-t-10 border-t-[#0DA464] p-6 overflow-auto relative">
                      <LaudoAnalise
                        data={pdfAnalises[selectedFileIndex].analise}
                        handleAddColl={handleAddColl}
                        handleRemoveColl={handleRemoveColl}
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
                  })()
            }
            className="absolute top-4 right-8 p-2 bg-white  text-[#0DA464] rounded-full border shadow-xl transition-colors z-20 cursor-pointer"
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
                          className="flex items-center justify-between p-2 rounded"
                        >
                          <span className="max-w-40 text-sm text-gray-500 truncate">
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
