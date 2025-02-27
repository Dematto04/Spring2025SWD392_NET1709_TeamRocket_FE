import { useUploadFilesMutation } from "@/redux/api/uploadFileApi";
import { Upload } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

const DragAndDropUpload = ({ files, setFiles }) => {
  const [upload, { isLoading, error, data }] = useUploadFilesMutation();
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (acceptedFiles) => {
      console.log("Accepted files:", acceptedFiles);

      if (acceptedFiles.length === 0) {
        console.log("No files selected");
        return;
      }      
      const formData = new FormData();
      acceptedFiles.forEach((file) => formData.append("files", file));
      try {
        const response = await upload(formData);
        console.log("Upload response:", response.data);
        setFiles(response?.data?.data?.map((url) => url))
      } catch (err) {
        console.error("Upload failed", err);
      }
    },
  });

 

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
            Drag and drop images or click to choose images
          </p>
          <Upload className="text-gray-600" size={32} />
        </div>
      </div>
      {isLoading && <p className="text-blue-500 mt-2">Uploading...</p>}
      {error && <p className="text-red-500 mt-2">Upload failed!</p>}
      {data && <p className="text-green-500 mt-2">Upload successful!</p>}
      <aside className="flex flex-wrap mt-4">
        {files && files.length > 0 && files.map((preview, index) => (
          <div
            key={index}
            className="inline-flex border border-gray-300 rounded-md p-1 w-[100px] h-[100px] m-2"
          >
            <div className="flex min-w-0 overflow-hidden">
              <img src={preview} className="block w-auto h-full object-cover" />
            </div>
          </div>
        ))}
      </aside>
    </section>
  );
};

export default DragAndDropUpload;
