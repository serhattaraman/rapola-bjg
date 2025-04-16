
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const DarkModeButton = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>("dark-mode", false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Update the document class when dark mode changes
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      className="rounded-full"
    >
      {isDarkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  );
};
