
import React, { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

export const DarkModeButton = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>("dark-mode", false);
  const { toast } = useToast();
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    
    // Show toast notification
    toast({
      title: newDarkModeState ? "Karanlık mod aktif" : "Aydınlık mod aktif",
      description: newDarkModeState 
        ? "Karanlık tema başarıyla etkinleştirildi." 
        : "Aydınlık tema başarıyla etkinleştirildi.",
      duration: 2000,
    });
  };

  // Update the document class when dark mode changes
  useEffect(() => {
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
      title={isDarkMode ? "Aydınlık moda geç" : "Karanlık moda geç"}
    >
      {isDarkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">
        {isDarkMode ? "Aydınlık moda geç" : "Karanlık moda geç"}
      </span>
    </Button>
  );
};
