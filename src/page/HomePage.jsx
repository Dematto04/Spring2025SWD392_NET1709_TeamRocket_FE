import Hero from "@/components/Home/Hero";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";

function HomePage() {
  const hehe = () => {
    console.log('hehe');
    
  }
  return (
    <>
      <Hero />
    </>
  );
}

export default HomePage;
