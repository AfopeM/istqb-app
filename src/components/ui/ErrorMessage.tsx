import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}: Props) {
  return (
    <div
      className={`
      flex flex-col items-center justify-center text-center space-y-4 
      p-8 rounded-2xl bg-red-50 border border-red-200 
      ${className}
    `}
    >
      <div className="p-3 bg-red-100 rounded-full">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-red-900">{title}</h3>
        <p className="text-red-700 max-w-md">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="
            inline-flex items-center gap-2 px-4 py-2
            bg-red-600 hover:bg-red-700 text-white
            rounded-lg font-medium transition-colors
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          "
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
