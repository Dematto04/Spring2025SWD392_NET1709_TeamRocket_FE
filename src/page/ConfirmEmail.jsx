import { toast } from "@/hooks/use-toast";
import { useConfirmEmailQuery } from "@/redux/api/authApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import React from "react";

function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const { data, isLoading, isSuccess, isError, error } = useConfirmEmailQuery({ token, userId });

  React.useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Email Confirmed!",
        description: "Please login 😊",
      });
      nav("/login");
    }
  }, [isSuccess, nav]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {isLoading && (
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
          <p className="mt-2 text-gray-600">Confirming your email...</p>
        </div>
      )}

      {isSuccess && (
        <Alert variant="success" className="w-full max-w-md text-center">
          <AlertTitle>Email Confirmed!</AlertTitle>
          <AlertDescription>You will be redirected to login shortly.</AlertDescription>
        </Alert>
      )}

      {isError && (
        <Alert variant="destructive" className="w-full max-w-md text-center">
          <AlertTitle>Confirmation Failed</AlertTitle>
          <AlertDescription>{error?.data?.message || "Something went wrong!"}</AlertDescription>
          <Button onClick={() => nav("/login")} className="mt-4">Go to Login</Button>
        </Alert>
      )}
    </div>
  );
}

export default ConfirmEmail;
