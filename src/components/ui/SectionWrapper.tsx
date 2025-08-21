import { cn } from "../../lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}
export default function SectionWrapper({ children, className }: Props) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden ",
        className
      )}
    >
      {/* WRAPPER DECORATION */}
      <div className="absolute z-0 inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute z-0 inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(147,197,253,0.1),transparent)]" />

      {children}
    </div>
  );
}
