
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";

export const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>("dark-mode", false);
  
  // Update the document class when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <Switch 
        checked={isDarkMode}
        onCheckedChange={setIsDarkMode}
        id="dark-mode-toggle"
      />
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </div>
  );
};
