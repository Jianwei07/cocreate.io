// components/SponsorLinks.tsx
import React from "react";
import { Coffee, Heart, Github } from "lucide-react";

interface SponsorLinksProps {
  orientation: "vertical" | "horizontal";
}

const SPONSOR_LINKS = [
  {
    name: "Buy Me a Coffee",
    icon: <Coffee className="h-5 w-5" />,
    url: "https://www.buymeacoffee.com/yourusername",
    bgColor: "bg-[#FFDD00]",
    textColor: "text-black",
  },
  {
    name: "Sponsor",
    icon: <Heart className="h-5 w-5" />,
    url: "https://github.com/sponsors/yourusername",
    bgColor: "bg-pink-600",
    textColor: "text-white",
  },
  {
    name: "GitHub",
    icon: <Github className="h-5 w-5" />,
    url: "https://github.com/Jianwei07",
    bgColor: "bg-gray-900",
    textColor: "text-white",
  },
] as const;

export default function SponsorLinks({ orientation }: SponsorLinksProps) {
  const containerClasses =
    orientation === "vertical"
      ? "flex flex-col gap-3"
      : "flex justify-center gap-3 overflow-x-auto pb-2";

  return (
    <div className={containerClasses}>
      {SPONSOR_LINKS.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            ${link.bgColor} ${link.textColor}
            flex items-center gap-2 px-4 py-2 rounded-full
            transition-transform hover:scale-105 shadow-md
            text-sm font-medium whitespace-nowrap
          `}
        >
          {link.icon}
          <span>{link.name}</span>
        </a>
      ))}
    </div>
  );
}
