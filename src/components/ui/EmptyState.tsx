import BackButton from "./BackButton";

interface EmptyStateProps {
  message: string;
  backTo: string;
  backText: string;
  onBackClick?: () => void;
}

export function EmptyState({
  message,
  backTo,
  backText,
  onBackClick,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <p>{message}</p>
        <BackButton to={backTo} text={backText} onClick={onBackClick} />
      </div>
    </div>
  );
}
