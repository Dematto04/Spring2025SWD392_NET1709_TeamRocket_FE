import CheckoutItems from "@/components/Checkout/CheckoutItems";
import { CheckoutSummary } from "@/components/Checkout/CheckoutSummary";
import React from "react";

function CheckoutPage() {
  return (
    <div className="w-full min-h-screen bg-secondary mb-48">
      <div className="container mx-auto px-6 lg:px-16 h-full py-40">
        <div className="w-full bg-background p-4 rounded-xl">
          <h1 className="text-xl leading-none tracking-tight font-semibold">
            Checkout
          </h1>
          <div className="flex flex-col md:flex-row gap-6 md:p-6">
            <div className="md:w-2/3">
              <CheckoutItems />
            </div>
            <div className="md:w-1/3">
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
