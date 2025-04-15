/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Player } from "@lottiefiles/react-lottie-player";
import { Trash2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-expect-error
import "swiper/css";
// @ts-expect-error
import "swiper/css/navigation";
import { PdfAnalise } from "../../pages/Home/PdfUpload";

interface SwiperPDFAnalisesProps {
  pdfAnalises: {
    file: File;
    status: "loading" | "success" | "error";
  }[];
  setPdfAnalises: (value: React.SetStateAction<PdfAnalise[]>) => void;
  setSelectedFileIndex: (index: number) => void;
  setViewMode: (viewMode: "single" | "compare") => void;
  handleRetryUpload: (file: File, index: number) => Promise<void>;
}

export default function SwiperPDFAnalises({
  pdfAnalises,
  setPdfAnalises,
  setSelectedFileIndex,
  setViewMode,
  handleRetryUpload,
}: SwiperPDFAnalisesProps) {
  return (
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
                    className="h-[150px] pe-2"
                  />
                ) : (
                  <img
                    src="/pdf-OCQ.svg"
                    alt="PDF"
                    className="w-full object-contain h-[150px]"
                  />
                )}
                {(file.status === "success" || file.status === "error") && (
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
                      onClick={() => handleRetryUpload(file.file, index)}
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
  );
}
