interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="mb-4 flex-grow">
      {/* Counter */}
      <div className="text-sm font-medium text-gray-700 mb-1">
        Question {current + 1} / {total}
      </div>

      {/* Bar */}
      <div className="w-full bg-gray-300 rounded-full h-1 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{
            width: `${(current / total) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
