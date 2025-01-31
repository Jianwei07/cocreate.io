import React from "react";
import { Coffee, Heart, Github, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SponsorLinksProps {
  orientation: "vertical" | "horizontal";
}

const SPONSOR_LINKS = [
  {
    name: "Buy Me a Coffee",
    icon: <Coffee className="h-5 w-5" strokeWidth={2.5} />,
    url: "https://buymeacoffee.com/jaydenliawjianwei",
    bgColor: "bg-[#ffdd00] hover:bg-[#e5c700]",
    textColor: "text-black",
    shadow: "shadow-[0_2px_8px_rgba(255,221,0,0.45)]",
  },
  {
    name: "Sponsor",
    icon: <Heart className="h-5 w-5" strokeWidth={2.5} />,
    url: "https://github.com/sponsors/Jianwei07",
    bgColor:
      "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
    textColor: "text-white",
    shadow: "shadow-[0_2px_8px_rgba(236,72,153,0.45)]",
  },
  {
    name: "GitHub",
    icon: <Github className="h-5 w-5" strokeWidth={2} />,
    url: "https://github.com/Jianwei07",
    bgColor: "bg-gray-900 hover:bg-gray-800",
    textColor: "text-white",
    shadow: "shadow-[0_2px_8px_rgba(0,0,0,0.25)]",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" strokeWidth={2} />,
    url: "https://www.linkedin.com/in/liawjianwei/",
    bgColor: "bg-[#0A66C2] hover:bg-[#004182]",
    textColor: "text-white",
    shadow: "shadow-[0_2px_8px_rgba(10,102,194,0.45)]",
  },
] as const;

export default function SponsorLinks({ orientation }: SponsorLinksProps) {
  return (
    <Card className="p-4 bg-white/50 backdrop-blur-sm border-none">
      <div
        className={`
          ${
            orientation === "vertical"
              ? "flex flex-col"
              : "flex flex-row justify-center"
          }
          gap-3 flex-wrap
        `}
      >
        {SPONSOR_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              ${link.bgColor} 
              ${link.textColor}
              ${link.shadow}
              flex items-center gap-2.5 
              px-5 py-2.5 
              rounded-full
              transition-all duration-300
              hover:transform hover:scale-105
              font-medium
              text-sm
              whitespace-nowrap
              backdrop-blur-sm
            `}
          >
            {link.icon}
            <span className="font-semibold">{link.name}</span>
          </a>
        ))}
      </div>
    </Card>
  );
}
