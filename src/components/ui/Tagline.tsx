import { cn } from "../../lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}
export default function Tagline({ children, className }: Props) {
  return (
    <span
      className={cn(
        "text-[10px] inline-block mb-3 tracking-wider uppercase py-2 px-4 rounded-sm bg-blue-500/20 backdrop-blur-lg text-blue-500 font-bold",
        className
      )}
    >
      {children}
    </span>
  );
}
