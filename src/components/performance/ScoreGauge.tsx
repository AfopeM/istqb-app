import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  /** Percentage value to display and fill the semicircle (0 – 100) */
  value: number;
  /** Width of the component (in pixels). Default: 200 */
  width?: number;
  /** Thickness of the progress stroke (in pixels). Default: 12 */
  strokeWidth?: number;
  /** Progress color. Default: blue-500 */
  progressColor?: string;
  /** Track color (unfilled path). Default: gray-200 */
  trackColor?: string;
  /** Whether to animate on mount. Default: true */
  animate?: boolean;
  /** Optional className */
  className?: string;
}

export default function ScoreGauge({
  value,
  width = 200,
  strokeWidth = 12,
  progressColor = "#3b82f6", // blue-500
  trackColor = "#e5e7eb", // gray-200
  animate = true,
  className = "",
}: ScoreGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  // Ensure value is within bounds
  const percentage = Math.min(100, Math.max(0, value));

  useEffect(() => {
    if (animate) {
      setAnimatedValue(0);
      const timer = setTimeout(() => {
        setAnimatedValue(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(percentage);
    }
  }, [percentage, animate]);

  // Calculate dimensions
  const height = width / 2 + strokeWidth;
  const centerX = width / 2;
  const centerY = width / 2;
  const radius = width / 2 - strokeWidth / 2;

  // Semicircle path (180 degrees)
  const semicircleLength = Math.PI * radius; // Half of circumference
  const progressOffset =
    semicircleLength - (animatedValue / 100) * semicircleLength;

  // Create the semicircle path
  const createSemicirclePath = (r: number) => {
    return `M ${centerX - r} ${centerY} A ${r} ${r} 0 0 1 ${centerX + r} ${centerY}`;
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="overflow-visible"
      >
        {/* Track (background semicircle) */}
        <path
          d={createSemicirclePath(radius)}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress semicircle */}
        <path
          d={createSemicirclePath(radius)}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={semicircleLength}
          strokeDashoffset={progressOffset}
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Percentage text */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          className="fill-gray-900 font-black"
          style={{ fontSize: width * 0.17 }}
        >
          {`${Math.round(animatedValue)}%`}
        </text>
      </svg>
    </div>
  );
}
