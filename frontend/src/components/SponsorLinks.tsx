import React, { useState } from "react";
import { Coffee, Heart, Github, Linkedin, X, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface SponsorLinksProps {
  orientation?: "vertical" | "horizontal";
}

const SPONSOR_LINKS = [
  {
    name: "Buy Me a Coffee",
    icon: <Coffee className="h-5 w-5" strokeWidth={2.5} />,
    url: "https://buymeacoffee.com/jaydenliawjianwei",
    bgColor: "bg-[#ffdd00]",
    hoverBgColor: "hover:bg-[#e5c700]",
    textColor: "text-black",
    shadow: "shadow-md",
  },
  {
    name: "Sponsor",
    icon: <Heart className="h-5 w-5" strokeWidth={2.5} />,
    url: "https://github.com/sponsors/Jianwei07",
    bgColor: "bg-pink-500",
    hoverBgColor: "hover:bg-pink-600",
    textColor: "text-white",
    shadow: "shadow-md",
  },
  {
    name: "GitHub",
    icon: <Github className="h-5 w-5" strokeWidth={2} />,
    url: "https://github.com/Jianwei07",
    bgColor: "bg-gray-900",
    hoverBgColor: "hover:bg-gray-800",
    textColor: "text-white",
    shadow: "shadow-md",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" strokeWidth={2} />,
    url: "https://www.linkedin.com/in/liawjianwei/",
    bgColor: "bg-[#0A66C2]",
    hoverBgColor: "hover:bg-[#004182]",
    textColor: "text-white",
    shadow: "shadow-md",
  },
] as const;

export default function SponsorLinks({
  orientation = "horizontal",
}: SponsorLinksProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Desktop render
  if (typeof window !== "undefined" && window.innerWidth >= 768) {
    return (
      <div className="w-full flex justify-center py-6">
        <Card className="max-w-2xl p-6 bg-white/50 backdrop-blur-sm border-none">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Connect & Support
            </h3>
            <div
              className={`flex ${
                orientation === "vertical"
                  ? "flex-col"
                  : "flex-row flex-wrap justify-center"
              } gap-3`}
            >
              {SPONSOR_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    ${link.bgColor} 
                    ${link.hoverBgColor}
                    ${link.textColor}
                    ${link.shadow}
                    flex items-center gap-2.5 
                    px-5 py-2.5 
                    rounded-full
                    transition-all duration-300
                    hover:scale-105
                    font-medium
                    text-sm
                    whitespace-nowrap
                  `}
                >
                  {link.icon}
                  <span className="font-semibold">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Mobile render
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-16 right-0 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg"
          >
            <div className="flex flex-col gap-3">
              {SPONSOR_LINKS.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: index * 0.1 },
                  }}
                  exit={{
                    opacity: 0,
                    x: 20,
                    transition: {
                      delay: (SPONSOR_LINKS.length - index - 1) * 0.1,
                    },
                  }}
                  className={`
                    ${link.bgColor}
                    ${link.hoverBgColor}
                    ${link.textColor}
                    ${link.shadow}
                    flex items-center gap-2.5
                    px-4 py-2
                    rounded-full
                    text-sm
                    font-medium
                    transition-transform
                    hover:scale-105
                    w-full
                  `}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          p-4
          rounded-full
          bg-blue-500
          text-white
          shadow-lg
          transition-transform
          hover:scale-105
          active:scale-95
        `}
      >
        {isExpanded ? <X className="h-6 w-6" /> : <Users className="h-6 w-6" />}
      </button>
    </div>
  );
}
