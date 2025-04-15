/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Trash2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

// @ts-expect-error
import "swiper/css";
// @ts-expect-error
import "swiper/css/navigation";

interface SwiperSelectFilesProps {
  selectedFiles: File[];
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleBrowseClick: () => void;
  removeFile: (index: number) => void;
}

export default function SwiperSelectFiles({
  selectedFiles,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleBrowseClick,
  removeFile,
}: SwiperSelectFilesProps) {
  return (
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
  );
}
