import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  to?: string;
  state?: unknown;
  loadingText?: string;
  className?: string;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      variant = "default",
      size = "md",
      isLoading = false,
      loadingText,
      className,
      children,
      disabled,
      to,
      state,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    // Base styles that apply to all buttons
    const baseStyles = cn(
      "inline-flex items-center justify-center",
      "rounded-lg transition-all duration-200 cursor-pointer",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-60",
    );

    const variantStyles = {
      default: cn(
        "bg-blue-500 text-white border-2 border-blue-500",
        "hover:bg-transparent hover:text-blue-500 backdrop-blur-lg",
        "disabled:bg-blue-300 disabled:border-blue-300",
      ),
      outline: cn(
        "bg-blue-100 border-2 text-blue-400 border-blue-300",
        "hover:text-blue-700 hover:bg-blue-200 border-blue-500 backdrop-blur-lg ",
        "disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200",
      ),
      ghost: cn(
        "bg-transparent text-blue-400 border-transparent font-medium",
        "hover:bg-blue-200 hover:text-blue-900 hover:backdrop-blur-lg hover:tracking-wider",
        "disabled:bg-transparent disabled:text-gray-300",
      ),
    };

    // Size styles
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-4 text-base",
    };

    // Combine all styles with className last for proper override
    const combinedClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className, // This comes last to ensure it can override everything
    );

    const ButtonContent = (
      <>
        {isLoading && (
          <Loader2
            className={cn(
              "mr-2 animate-spin",
              size === "sm" && "size-3",
              size === "md" && "size-4",
              size === "lg" && "size-5",
            )}
            aria-hidden="true"
          />
        )}
        {isLoading ? loadingText || "Loading..." : children}
      </>
    );

    const buttonElement = (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={isDisabled}
        {...props}
      >
        {ButtonContent}
      </button>
    );

    // Wrap in Link if 'to' prop is provided
    if (to) {
      return (
        <Link to={to} state={state} className="inline-block">
          {buttonElement}
        </Link>
      );
    }

    return buttonElement;
  },
);

Button.displayName = "Button";

export default Button;
