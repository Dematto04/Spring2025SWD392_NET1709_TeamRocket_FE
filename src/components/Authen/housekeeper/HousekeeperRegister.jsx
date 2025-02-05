import React from "react";
import { StepperHeader, StepperExample } from "../../ui/stepper";
import Logo from "../../Logo";
import { ThemeToggle } from "../../ui/theme-toggle";
import HousekeeperAccountForm from "./HousekeeperAccountForm";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import schema from "./formSchema";
import { useDispatch } from "react-redux";
import { housekeeperRegister } from "@/redux/features/housekeeperRegisterSlice";
import HousekeeperSelfForm from "./HousekeeperSelfForm";

const HousekeeperRegister = () => {
  const dispatch = useDispatch();
  const registerForm = useForm({
    resolver: zodResolver(schema.register),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const selfForm = useForm({
    resolver: zodResolver(schema.self),
    defaultValues: {
      fullName: "",
      dob: "",
      phone: "",
      address: "",
      services: [],
      workingTime: "",
      salary: ""
    },
  });
  const steps = [
    {
      label: "Account",
      description: "Register Account",
      stepItem: <HousekeeperAccountForm form={registerForm} />,
    },
    {
      label: "Profile",
      description: "Account Setup",
      stepItem: <HousekeeperSelfForm form={selfForm} />,
    },
    { label: "CV", description: "Experience" },
    { label: "Complete", description: "Final Step" },
  ];
  const handleNextStep = [
    //Handle Register
    async () => {
      const isValid = await registerForm.trigger();
      if (isValid) {
        dispatch(
          housekeeperRegister({
            email: registerForm.getValues("email"),
            password: registerForm.getValues("password"),
          })
        );
        console.log('step 1');
        
      }
      if (!isValid) return false;
      return true;
    },
    //Handle Self
    async () => {
      const isValid = await selfForm.trigger();
      if (isValid) {
        console.log('step 2');
        console.log(selfForm.getValues());
        

      }
      if (!isValid) return false;
      return true;
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      <StepperExample steps={steps} handleNextStep={handleNextStep}>
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
