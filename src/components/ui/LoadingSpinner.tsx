import { Loader2 } from "lucide-react";

interface Props {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  text = "Loading...",
  className = "",
}: Props) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
        {text}
      </p>
    </div>
  );
}
