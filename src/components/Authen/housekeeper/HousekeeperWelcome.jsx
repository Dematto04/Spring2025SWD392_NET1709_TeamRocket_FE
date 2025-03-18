import React from "react";
import Fireworks from "@fireworks-js/react";
import ReactConfetti from "react-confetti";

function HousekeeperWelcome() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-96">
      <Fireworks
        options={{
          intensity: 5,
          friction: 0.98,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <ReactConfetti
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <h1 className="relative z-10 text-3xl font-bold text-primary">
        Thanks for apply in Purrfect Clean! 🎉
      </h1>
      <h2>Please check your email to comfirm email!</h2>
      <h1 className="relative z-10 text-2xl font-bold mt-6 ">
        Staff will annouce u soon!
      </h1>
    </div>
  );
}

export default HousekeeperWelcome;
