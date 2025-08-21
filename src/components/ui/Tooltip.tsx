import { useState } from "react";

interface TooltipProps {
  children: React.ReactNode; // The element you hover over
  text: string; // The tooltip text
  position?: "top" | "bottom" | "left" | "right"; // Tooltip position
}

export default function Tooltip({
  children,
  text,
  position = "top",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  // Positioning logic
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap ${positionClasses[position]}`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
