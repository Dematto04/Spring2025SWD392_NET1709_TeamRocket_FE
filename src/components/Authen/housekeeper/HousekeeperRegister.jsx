import React, { useState } from "react";
import { StepperHeader, StepperExample } from "../../ui/stepper";
import Logo from "../../Logo";
import { ThemeToggle } from "../../ui/theme-toggle";
import HousekeeperAccountForm from "./HousekeeperAccountForm";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import schema from "./formSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  housekeeperRegister,
  registerProfile,
  selectRegisterProfile,
} from "@/redux/features/housekeeperRegisterSlice";
import HousekeeperSelfForm from "./HousekeeperSelfForm";
import HousekeeperUploadForm from "./HousekeeperUploadForm";
import HousekeeperRegisterComplete from "./HousekeeperRegisterComplete";
import HousekeeperWelcome from "./HousekeeperWelcome";
import { login } from "@/redux/features/authSlice";

const HousekeeperRegister = () => {
  const profile = useSelector(selectRegisterProfile);
  const [idFront, setIdFront] = useState(profile.cv?.idFront || null);
  const [idBack, setIdBack] = useState(profile.cv?.idBack || null);
  const [cv, setCv] = useState(profile.cv?.cv || null);
  const dispatch = useDispatch();
  const nav = useNavigate();

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
      fullName: profile.fullName || "",
      dob: profile.dob || "",
      phone: profile.phone || "",
      address: profile.address || "",
      services: profile.services || [],
      workingTime: profile.workingTime || "",
      salary: profile.salary || "",
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
    {
      label: "CV",
      description: "Experience",
      stepItem: (
        <HousekeeperUploadForm
          idFront={idFront}
          setIdFront={setIdFront}
          idBack={idBack}
          setIdBack={setIdBack}
          cv={cv}
          setCv={setCv}
        />
      ),
    },
    {
      label: "Complete",
      description: "Final Step",
      stepItem: <HousekeeperRegisterComplete />,
    },
    {
      label: "Successfully",
      description: "Welcome",
      stepItem: <HousekeeperWelcome />,
    },
  ];

  const handleNextStep = [
    //account email password
    async () => {
      const isValid = await registerForm.trigger();
      if (isValid) {
        dispatch(
          housekeeperRegister({
            email: registerForm.getValues("email"),
            password: registerForm.getValues("password"),
          })
        );
        console.log("step 1");
      }
      return isValid;
    },
    //profile
    async () => {
      const isValid = await selfForm.trigger();
      dispatch(
        registerProfile({
          fullName: selfForm.getValues("fullName"),
          dob: selfForm.getValues("dob"),
          phone: selfForm.getValues("phone"),
          address: selfForm.getValues("address"),
          services: selfForm.getValues("services"),
          workingTime: selfForm.getValues("workingTime"),
          salary: selfForm.getValues("salary"),
        })
      );
      return isValid;
    },
    //cv
    async () => {
      // if (!cv || !idFront || !idBack) return false;
      return true;
    },
    // review cv

    async () => {
      return true;
    },
    // review complete
    async () => {
      dispatch(login({ email: "long" }));
      nav("/", {replace: true});
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
};

export default HousekeeperRegister;
