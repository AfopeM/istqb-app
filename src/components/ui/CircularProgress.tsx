import React, { useEffect, useState } from "react";

interface CircularProgressProps {
  /**
   * Percentage value to display and fill the circle (0 – 100)
   */
  value: number;
  /** Diameter of the svg circle (in pixels). Default: 120 */
  size?: number;
  /**
   * Thickness of the progress stroke (in pixels). Default: 12
   */
  strokeWidth?: number;
  /** Primary gradient color. Default: blue-600 */
  primaryColor?: string;
  /** Secondary gradient color. Default: purple-600 */
  secondaryColor?: string;
  /** Track color (unfilled path). Default: gray-200 with 0.2 opacity */
  trackColor?: string;
  /**
   * Optional className to apply to the wrapping div
   */
  className?: string;
  /** Whether to show quarter indicators. Default: true */
  showTicks?: boolean;
  /** Whether to animate on mount. Default: true */
  animate?: boolean;
}

/**
 * Lightweight circular progress component built with plain SVG.
 * No additional dependencies required.
 */
const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 12,
  primaryColor = "#2563eb", // blue-600
  secondaryColor = "#9333ea", // purple-600
  trackColor = "rgba(229, 231, 235, 0.2)", // gray-200 with opacity
  className,
  showTicks = true,
  animate = true,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [glowPosition, setGlowPosition] = useState(0);

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

  // Animate glow position
  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setGlowPosition((prev) => (prev + 2) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  useEffect(() => {
    if (animatedValue === 100 && !isComplete) {
      setIsComplete(true);
    } else if (animatedValue < 100 && isComplete) {
      setIsComplete(false);
    }
  }, [animatedValue, isComplete]);

  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;

  // Create gradient definition
  const gradientId = `progress-gradient-${size}`;
  const glowId = `progress-glow-${size}`;

  // Calculate quarter points for ticks
  const quarterPoints = [25, 50, 75].map((quarter) => {
    const angle = (quarter / 100) * 360 - 90;
    const radians = (angle * Math.PI) / 180;
    const x = center + (radius - strokeWidth) * Math.cos(radians);
    const y = center + (radius - strokeWidth) * Math.sin(radians);
    return { x, y };
  });

  // Calculate glow trail position
  const glowTrailAngle = (glowPosition - 90) * (Math.PI / 180);
  const glowX = center + radius * Math.cos(glowTrailAngle);
  const glowY = center + radius * Math.sin(glowTrailAngle);

  return (
    <div
      className={`relative group ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width={size}
        height={size}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`transform ${
          isComplete ? "animate-bounce" : ""
        } cursor-pointer`}
      >
        <defs>
          <linearGradient id={gradientId} gradientTransform="rotate(90)">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          <radialGradient id="radial-bg">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </radialGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-trail">
            <feGaussianBlur stdDeviation="4" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.2 
                      0 0 0 0 0.4 
                      0 0 0 0 1 
                      0 0 0 1 0"
            />
          </filter>
        </defs>

        {/* Radial gradient background */}
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          fill="url(#radial-bg)"
          className="opacity-10"
        />

        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />

        {/* Quarter ticks */}
        {showTicks &&
          quarterPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={2}
              fill={trackColor}
              className="opacity-50"
            />
          ))}

        {/* Glow Trail */}
        {isHovered && (
          <circle
            cx={glowX}
            cy={glowY}
            r={strokeWidth / 2}
            fill={primaryColor}
            filter="url(#glow-trail)"
            opacity="0.6"
          />
        )}

        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: isComplete ? `url(#${glowId})` : "none",
          }}
          className="group-hover:filter-none transition-filter duration-300"
          onClick={() => {
            if (isComplete) {
              setIsComplete(false);
              setAnimatedValue(0);
              setTimeout(() => {
                setAnimatedValue(percentage);
              }, 100);
            }
          }}
        />

        {/* Percentage text with gradient */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className="font-semibold"
          style={{
            fontSize: size * 0.22,
            fill: `url(#${gradientId})`,
          }}
        >
          {`${Math.round(animatedValue)}%`}
        </text>
      </svg>
    </div>
  );
};

export default CircularProgress;
