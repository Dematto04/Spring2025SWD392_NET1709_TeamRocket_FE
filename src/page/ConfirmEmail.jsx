import { toast } from "@/hooks/use-toast";
import { useConfirmEmailQuery } from "@/redux/api/authApi";
import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  console.log({ token, userId });
  const { data, isLoading, isSuccess } = useConfirmEmailQuery({token, userId});
  if (isSuccess) {
    console.log({ data });
    nav("/login");
    toast({
        title: 'Confirm Email Successfully!',
        description: "Please login 😊"
    })
  }
  return <div>ConfirmEmail</div>;
}

export default ConfirmEmail;
