import Button from "./Button";
import { cn } from "../../lib/utils";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  to,
  text,
  onClick,
  className,
}: {
  to: string;
  text: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      to={to}
      variant="outline"
      className={cn("group space-x-2 font-bold", className)}
      onClick={onClick}
    >
      <ArrowLeft
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
      />
      <span>{text}</span>
    </Button>
  );
}
