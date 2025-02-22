import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const ServiceBookContext = createContext();
const formSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(10, { message: "Invalid phone number" }),
  dob: z.string().min(1, { message: "Date of birth is required" }),
});
function ServiceBookProvider({ children }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState();
  const [step, setStep] = useState(0);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      dob: "",
    },
  });
  return (
    <ServiceBookContext.Provider
      value={{
        date,
        setDate,
        time,
        setTime,
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
