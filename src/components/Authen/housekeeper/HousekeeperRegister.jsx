import React from "react";
import { StepperHeader, StepperExample } from "../../ui/stepper";
import Logo from "../../Logo";
import { ThemeToggle } from "../../ui/theme-toggle";
import HousekeeperAccountForm from "./HousekeeperAccountForm";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import HousekeeperProfileForm from "./HousekeeperProfileForm";

const formSchema = z
  .object({
    email: z.string().email({
      message: "Invalid Email",
    }),
    password: z.string().min(6, "Password must at least 6 characters"),
    confirmPassword: z.string().min(4),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });
function HousekeeperRegister() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const steps = [
    {
      label: "Account",
      description: "Personal Info",
      stepItem: <HousekeeperAccountForm form={form} />,
    },
    {
      label: "Profile",
      description: "Account Setup",
      stepItem: <HousekeeperProfileForm />,
    },
    { label: "CV", description: "Experience" },
    { label: "Complete", description: "Final Step" },
  ];
  //Handle Register
  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if(isValid){
        //call api register, xài form.getValues
        
       
    }
    if (!isValid) return false; 
    return true;
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      <StepperExample
        steps={steps}
        handleNextStep={handleSubmit}
        form={form}
      >
        <StepperHeader>
          <div className="flex justify-center items-center gap-8">
            <Link to="/">
              <Logo />
            </Link>
            <ThemeToggle />
          </div>
        </StepperHeader>
      </StepperExample>
    </div>
  );
}

export default HousekeeperRegister;
