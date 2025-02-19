import React from "react";
import { useTheme } from "./theme-provider";
import { Link } from "react-router-dom";


function Logo({ className, classImg }) {
  const { theme } = useTheme();

  return (
    <Link to={'/'} className={`w-40 ${className} block`}>
      <img
        src={theme === "light" ? `/logo.png` : `/logo-dark.png`}
        className={`w-full ${classImg}`}
      />
    </Link>
  );
}

export default Logo;
