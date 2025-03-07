import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return { theme, toggleTheme };
}
