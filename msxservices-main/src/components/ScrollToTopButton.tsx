import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-5 p-3 bg-primary text-white rounded-full shadow-lg transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ zIndex: 9999 }}
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};

export default ScrollToTopButton;
