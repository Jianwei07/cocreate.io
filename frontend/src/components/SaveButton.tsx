// components/SaveButton.tsx
import React from "react";

interface SaveButtonProps {
  onSave: () => void;
}

export default function SaveButton({ onSave }: SaveButtonProps) {
  return (
    <button
      onClick={onSave}
      className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
    >
      Save Content
    </button>
  );
}
