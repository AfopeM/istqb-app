interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="mt-2 mb-4 flex-grow">
      {/* Counter */}
      <div className="mb-2 text-sm font-medium text-gray-500">
        Question {current + 1} / {total}
      </div>

      {/* Bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-300">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{
            width: `${((current + 1) / total) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
