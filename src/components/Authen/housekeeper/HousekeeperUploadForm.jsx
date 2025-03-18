import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUploadFilesMutation } from "@/redux/api/uploadFileApi";
import { FileUser, IdCard } from "lucide-react";
import React, { useRef } from "react";


function HousekeeperUploadForm({
  idFront,
  setIdFront,
  idBack,
  setIdBack,
  cv,
  setCv,
}) {
  const [upload, { isLoading }] = useUploadFilesMutation();
  const { toast } = useToast();
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const cvRef = useRef(null);

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await upload(formData).unwrap();
      
      if (response.isSucceed) {
        return response.data[0];
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload file",
        });
        return null;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error uploading file",
      });
      console.error('Upload error:', error);
      return null;
    }
  };

  // Front ID card handle
  const handleFrontChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size must be less than 5MB",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image file",
      });
      return;
    }

    const fileUrl = await handleFileUpload(file);
    if (fileUrl) {
      setIdFront(fileUrl);
      toast({
        title: "Success",
        description: "Front ID card uploaded successfully",
      });
    }
  };

  // Back ID card handle
  const handleBackChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size must be less than 5MB",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image file",
      });
      return;
    }

    const fileUrl = await handleFileUpload(file);
    if (fileUrl) {
      setIdBack(fileUrl);
      toast({
        title: "Success",
        description: "Back ID card uploaded successfully",
      });
    }
  };

  const handleCvChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File size must be less than 10MB",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image file",
      });
      return;
    }

    const fileUrl = await handleFileUpload(file);
    if (fileUrl) {
      setCv(fileUrl);
      toast({
        title: "Success",
        description: "CV uploaded successfully",
      });
    }
  };

  return (
    <div className="w-full mt-8 px-8">
      <div className="font-medium">1. Identity Card</div>
      <div className="flex flex-wrap sm:flex-nowrap gap-10 w-full mt-4">
        {/* front */}
        <div className="relative min-h-48 w-full border rounded-2xl">
          <Input
            type="file"
            accept="image/*"
            className="relative z-[2] w-full h-full opacity-0 cursor-pointer"
            onChange={handleFrontChange}
            disabled={isLoading}
          />
          <img
            ref={frontRef}
            src={idFront}
            alt="Front ID Card"
            className={`${
              idFront ? "block" : "hidden"
            } absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain`}
          />
          <div className={`absolute flex flex-col justify-center z-[0] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${idFront ? 'hidden' : 'block'}`}>
            <IdCard strokeWidth={0.8} size={70} />
            <div className="text-center font-medium">Front</div>
          </div>
        </div>
        {/* Back */}
        <div className="relative min-h-48 w-full border rounded-2xl">
          <Input
            type="file"
            accept="image/*"
            className="relative z-[2] w-full h-full border rounded-2xl opacity-0 cursor-pointer"
            onChange={handleBackChange}
            disabled={isLoading}
          />
          <img
            ref={backRef}
            src={idBack}
            alt="Back ID Card"
            className={`${
              idBack ? "block" : "hidden"
            } absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain`}
          />
          <div className={`absolute flex flex-col justify-center z-[0] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${idBack ? 'hidden' : 'block'}`}>
            <IdCard strokeWidth={0.8} size={70} />
            <div className="text-center font-medium">Back</div>
          </div>
        </div>
      </div>
      {/* CV */}
      <div className="font-medium mt-4">2. Upload CV</div>
      <div className="grid grid-cols-2 gap-10 w-full mt-4 min-h-[450px]">
        <div className="relative border col-span-1">
          <Input
            type="file"
            accept="image/*"
            className="relative z-[2] w-full h-full cursor-pointer opacity-0"
            onChange={handleCvChange}
            disabled={isLoading}
          />
          <img
            ref={cvRef}
            src={cv}
            alt="CV Preview"
            className={`${
              cv ? "block" : "hidden"
            } absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain`}
          />

          <div className={`absolute z-0 flex justify-center items-center flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${cv ? 'hidden' : 'block'}`}>
            <FileUser strokeWidth={0.8} size={70} />
            <p className="text-center font-medium">Upload your CV here!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HousekeeperUploadForm;
