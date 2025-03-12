import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProcessDepositMutation } from '@/redux/api/walletApi';
import { toast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  // const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // const [processDeposit] = useProcessDepositMutation();

  // useEffect(() => {
  //   const handlePaymentSuccess = async () => {
  //     const status = searchParams.get('vnp_ResponseCode');
  //     const amount = searchParams.get('vnp_UsdAmount');

  //     if (status === '00' && amount) {
  //       try {
  //         await processDeposit({
  //           status: status,
  //           amount: Number(amount)
  //         }).unwrap();

  //         toast({
  //           title: "Success",
  //           description: "Your deposit has been processed successfully",
  //         });
  //       } catch (error) {
  //         toast({
  //           title: "Error",
  //           description: "Failed to process deposit",
  //           variant: "destructive"
  //         });
  //         navigate('/wallet/deposit/fail');
  //       }
  //     } else {
  //       navigate('/wallet/deposit/fail');
  //     }
  //   };

  //   handlePaymentSuccess();
  // }, [searchParams, processDeposit, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-8 w-8" />
            Payment Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Your payment has been processed successfully. The amount will be added to your wallet shortly.
          </p>
          {/* <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Amount Deposited</p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(Number(searchParams.get('vnp_Amount')) / 100)}
            </p>
          </div> */}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate('/profile/customer')}>
            Return to Wallet
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 