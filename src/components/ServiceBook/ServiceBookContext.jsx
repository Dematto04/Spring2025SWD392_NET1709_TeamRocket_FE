import { selectUser } from "@/redux/features/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

export const ServiceBookContext = createContext();
const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(10, { message: "Invalid phone number" }),
  location: z.string().min(1, { message: "Address is required" }),
  address_line: z.string(),
  city: z.string(),
  district: z.string(),
  place_id: z.string(),
});
function ServiceBookProvider({ children }) {
  const [step, setStep] = useState(0);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber:  "",
      location: "",
      city: "",
      district: "",
      place_id: "",
    },
  });
  return (
    <ServiceBookContext.Provider
      value={{
        step,
        setStep,
        form,
      }}
    >
      {children}
    </ServiceBookContext.Provider>
  );
}

export default ServiceBookProvider;
