import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant="outline" className="p-2 rounded-full">
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
};
