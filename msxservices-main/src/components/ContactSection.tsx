import { Button } from "@/components/ui/button"; // Si tu as un composant Button
import React from "react";
import { CircleUser,  Mail, Github, Instagram  } from "lucide-react";
import { useEffect, useState } from "react";

export const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Utilisation de l'Intersection Observer pour détecter la visibilité de la section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true); // L'élément est visible
          }
        });
      },
      {
        threshold: 0.5, // L'élément doit être visible à 50% pour déclencher l'animation
      }
    );

    const element = document.getElementById("contact-section");
    if (element) observer.observe(element);

    // Cleanup lorsque le composant est démonté
    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section
      id="contact-section"
      className={`py-20 bg-gray-50 ${isVisible ? "animate-slide-up" : ""}`}
    >
  <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* Icône juste au-dessus du titre */}
          <CircleUser className="h-12 w-12 text-primary mx-auto mb-4" />
          
          <h2 className="text-4xl font-bold mb-4">Nous Contacter</h2>
          <p className="text-xl text-secondary/80">Nous serons ravis de vous aider !</p>
        </div>


       
        <div className="flex flex-col items-center space-y-6">
          {/* Adresse mail */}
          <a
            href="mailto:clement10600@gmail.com"
            className="flex items-center text-lg text-primary hover:underline"
          >
            <Mail className="h-6 w-6 mr-3" />
            Mail
          </a>

          {/* Discord */}
          <a
            href="https://discord.com/users/1013841028060561560"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-lg text-primary hover:underline"
          >
            <CircleUser className="h-6 w-6 mr-3" />
            Discord
          </a>

          {/* Github */}
          <a
            href="https://github.com/mousxtache-stack"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-lg text-primary hover:underline"
          >
            <Github className="h-6 w-6 mr-3" />
            Github
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/clem.ncs/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-lg text-primary hover:underline"
          >
            <Instagram className="h-6 w-6 mr-3" />
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
};
