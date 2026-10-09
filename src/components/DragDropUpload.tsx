import { useState } from "react";

const DragDropUpload = () => {
  const [images, setImages] = useState<File[]>([]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);
    setImages(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); //  VERY IMPORTANT
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="">
      {/* DROP ZONE */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-400 bg-[#FBFBFB] p-10 text-center rounded-lg cursor-pointer"
      >
        <p>Drag & Drop images here</p>
        <p className="text-sm text-gray-500">or click to upload</p>

        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="fileInput"
        />

        <label htmlFor="fileInput" className="cursor-pointer text-blue-500">
          Choose Files
        </label>
      </div>

      {/* PREVIEW */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={URL.createObjectURL(img)}
            alt="preview"
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default DragDropUpload;
