import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen w-screen">
      <Loader2 className="animate-spin text-blue-500" size={64} />
      <p className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
        Loading{dots}
      </p>
    </div>
  );
}
