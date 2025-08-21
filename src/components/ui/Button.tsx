import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "filled" | "ghost";
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
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const baseClasses = "btn";
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;

    const combinedClasses = cn(baseClasses, variantClass, sizeClass, className);

    const ButtonInner = (
      <>
        {isLoading && (
          <Loader2 className="size-4 mr-2 animate-spin" aria-hidden="true" />
        )}
        {isLoading ? loadingText || "Loading..." : children}
      </>
    );

    if (to) {
      return (
        <Link to={to} state={state}>
          <button
            ref={ref}
            className={combinedClasses}
            disabled={isDisabled}
            {...props}
          >
            {ButtonInner}
          </button>
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={combinedClasses}
        disabled={isDisabled}
        {...props}
      >
        {ButtonInner}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
