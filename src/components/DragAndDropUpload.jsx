import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const DragAndDropUpload = ({ files, setFiles }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs = files.map((file) => (
    <div
      key={file.name}
      className="inline-flex border border-gray-300 rounded-md p-1 w-[100px] h-[100px] m-2"
    >
      <div className="flex min-w-0 overflow-hidden">
        <img
          src={file.preview}
          className="block w-auto h-full"
          onLoad={() => URL.revokeObjectURL(file.preview)}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div
        {...getRootProps({
          className:
            "border-2 border-dashed border-gray-400 rounded-md p-6 text-center cursor-pointer hover:bg-gray-100 transition",
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="text-gray-600">
            Drag and drop images or click to choose images{" "}
          </p>
          <Upload className="text-gray-600" size={32}/>
        </div>
      </div>
      <aside className="flex flex-wrap mt-4">{thumbs}</aside>
    </section>
  );
};

export default DragAndDropUpload;
