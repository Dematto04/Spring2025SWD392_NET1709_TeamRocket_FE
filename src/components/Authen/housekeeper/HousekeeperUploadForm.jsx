import { Input } from "@/components/ui/input";
import { uploadFile } from "@/firebase/config";
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
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const cvRef = useRef(null);
  // Front ID card handle
  const handleFrontChange = async (e) => {
    
  };
  //Back ID card handle
  const handleBackChange = async (e) => {
    
  };
  const handleCvChange = async (e) => {
  
  };
  console.log({ idBack, idFront, cv });

  return (
    <div className="w-full mt-8 px-8">
      <div className="font-medium">1. Identity Card</div>
      <div className="flex flex-wrap sm:flex-nowrap gap-10 w-full mt-4">
        {/* front */}
        <div className="relative min-h-48 w-full border rounded-2xl">
          <Input
            type="file"
            className="relative z-[2] w-full h-full opacity-0 cursor-pointer"
            onChange={handleFrontChange}
          />
          <img
            ref={frontRef}
            src={idFront && idFront}
            alt=""
            className={`${
              idFront ? "block" : "hidden"
            } absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full`}
          />
          <div className="absolute flex flex-col justify-center z-[0] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <IdCard strokeWidth={0.8} size={70} />
            <div className="text-center font-medium">Front</div>
          </div>
        </div>
        {/* Back */}
        <div className="relative min-h-48 w-full border rounded-2xl">
          <Input
            type="file"
            className="relative z-[2] w-full h-full border rounded-2xl opacity-0 cursor-pointer"
            onChange={handleBackChange}
          />
          <img
            ref={backRef}
            src={idBack && idBack}
            alt=""
            className={`${
              idBack ? "block" : "hidden"
            } absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full`}
          />
          <div className="absolute flex flex-col justify-center z-[0] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
            className="relative z-[2] w-full h-full cursor-pointer opacity-0"
            onChange={handleCvChange}
          />
          <img
            ref={cvRef}
            src={cv && cv}
            alt="hehe"
            className={`${
              cv ? "block" : "hidden"
            } absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full`}
          />

          <div className="absolute z-0 flex justify-center items-center flex-col left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <FileUser strokeWidth={0.8} size={70} />
            <p className="text-center font-medium">Upload your CV here!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HousekeeperUploadForm;
