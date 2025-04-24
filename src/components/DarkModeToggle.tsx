
import React, { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "./ui/switch";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

export const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>("dark-mode", false);
  const { toast } = useToast();
  
  // Handle theme change
  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    
    // Show toast notification
    toast({
      title: checked ? "Karanlık mod aktif" : "Aydınlık mod aktif",
      description: checked 
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
    <div className="flex items-center gap-2">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <Switch 
        checked={isDarkMode}
        onCheckedChange={handleThemeChange}
        id="dark-mode-toggle"
        aria-label={isDarkMode ? "Aydınlık moda geç" : "Karanlık moda geç"}
      />
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </div>
  );
};
