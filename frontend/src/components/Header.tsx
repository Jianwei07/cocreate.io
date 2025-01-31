// components/Header.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Header() {
  return (
    <Card className="border-0 bg-white/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          CoCreate.io
        </CardTitle>
        <CardDescription className="text-base lg:text-lg">
          Social Media Content Assistant
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
