interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="mt-2 mb-4 flex-grow">
      {/* Counter */}
      {/* <div className="mb-2 text-sm font-medium text-gray-500">
        Question {current + 1} / {total}
      </div> */}

      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>
          Question {current + 1} of {total}
        </span>
        <span>
          {Math.round(((current + 1) / (total || 1)) * 100)}% Complete
        </span>
      </div>

      {/* Bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-300">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{
            width: `${((current + 1) / total) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
