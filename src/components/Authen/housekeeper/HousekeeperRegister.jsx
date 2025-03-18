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
  resetRegisterProfile,
  selectRegisterProfile,
} from "@/redux/features/housekeeperRegisterSlice";
import HousekeeperSelfForm from "./HousekeeperSelfForm";
import HousekeeperUploadForm from "./HousekeeperUploadForm";
import HousekeeperRegisterComplete from "./HousekeeperRegisterComplete";
import HousekeeperWelcome from "./HousekeeperWelcome";
import { login } from "@/redux/features/authSlice";
import { toast } from "@/hooks/use-toast";
import { useCheckEmailMutation, useHousekeeperRegisterMutation } from "@/redux/api/authApi";
const HousekeeperRegister = () => {
  const profile = useSelector(selectRegisterProfile);
  const [idFront, setIdFront] = useState(profile?.cv?.idFront || null);
  const [idBack, setIdBack] = useState(profile?.cv?.idBack || null);
  const [cv, setCv] = useState(profile?.cv?.cv || null);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [housekeeperRegisterMutation, { isSuccess: isRegisterSuccess }] =
    useHousekeeperRegisterMutation();
  const [checkEmail, { isSuccess: isCheckEmailSuccess }] = useCheckEmailMutation();

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
      fullName: profile?.fullName || "",
      dob: profile?.dob || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      services: [],
      workingTime: profile?.workingTime || "",
      salary: profile?.salary || "",
      location: profile?.location || "",
      place_id: "",
      district: "",
      address_line: "",
      city: "",
      title: "Home",
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
      label: "Success",
      description: "Welcome",
      stepItem: <HousekeeperWelcome />,
    },
  ];

  const handleNextStep = [
    //account email password
    async () => {
      const isValid = await registerForm.trigger();
      if (isValid) {
        const res = await checkEmail(registerForm.getValues("email"));
        if(res.error){
          registerForm.setError("email", {
            message: res.error.data.messages.Error[0] || "Email already exists",
          });
         
          return false;
        }
        dispatch(
          housekeeperRegister({
            email: registerForm.getValues("email"),
            password: registerForm.getValues("password"),
          })
        );
      }
      return isValid;
    },
    //profile
    async () => {
      const isValid = await selfForm.trigger();
      console.log(isValid);
      
      
      dispatch(
        registerProfile({
          fullName: selfForm.getValues("fullName"),
          dob: selfForm.getValues("dob"),
          phone: selfForm.getValues("phone"),
          services: selfForm.getValues("services"),
          workingTime: selfForm.getValues("workingTime"),
          salary: selfForm.getValues("salary"),
          location: selfForm.getValues("location"),
          place_id: selfForm.getValues("place_id"),
          district: selfForm.getValues("district"),
          city: selfForm.getValues("city"),
          title: selfForm.getValues("title"),
          address_line: selfForm.getValues("address_line"),
        })
      );

      return isValid;
    },
    //cv
    async () => {
      if (!cv || !idFront || !idBack) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please upload all required files",
          duration: 3000,
        });
        return false;
      }
      return true;
    },
    // review application
    async () => {
      const res = await housekeeperRegisterMutation({
        full_name: selfForm.getValues("fullName"),
        email: registerForm.getValues("email"),
        phone_number: selfForm.getValues("phone"),
        password: registerForm.getValues("password"),
        confirm_password: registerForm.getValues("confirmPassword"),
        certificate_picture: cv,
        id_card_front: idFront,
        id_card_back: idBack,
        housekeeper_categories: selfForm.getValues("services"),
        housekeeper_address_line: selfForm.getValues("address_line"),
        housekeeper_city: selfForm.getValues("city"),
        housekeeper_place_id: selfForm.getValues("place_id"),
        housekeeper_district: selfForm.getValues("district"),
        housekeeper_address_title: selfForm.getValues("title"),
      });
      if(res.error){
        toast({
          variant: "destructive",
          title: "Error",
          description: res.error.data.messages.Validate[0] || "Invalid information",
        });
        return false
      }

      return true;
    },
    // complete
    async () => {
      dispatch(resetRegisterProfile());
      
      nav("/", { replace: true });
      return true;
    },
  ];

  return (
    <div className="min-h-screen  flex flex-col items-center justify-start py-4 px-3">
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
