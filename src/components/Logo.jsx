import React from "react";
import { useTheme } from "./theme-provider";


function Logo({ className, classImg }) {
  const { theme } = useTheme();

  return (
    <div className={`w-40 ${className}`}>
      <img
        src={theme === "light" ? `/logo.png` : `/logo-dark.png`}
        className={`w-full ${classImg}`}
      />
    </div>
  );
}

export default Logo;
