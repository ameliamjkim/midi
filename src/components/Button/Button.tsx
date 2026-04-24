import { clsx } from "clsx";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.scss";

type ButtonHierarchy =
  | "primary"
  | "secondary"
  | "tertiary"
  | "link-color"
  | "link-gray";
type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual hierarchy of the button */
  hierarchy?: ButtonHierarchy;
  /** Size of the button */
  size?: ButtonSize;
  /** Optional icon rendered before the label */
  iconLeading?: ReactNode;
  /** Optional icon rendered after the label */
  iconTrailing?: ReactNode;
  /** When true, renders a loading indicator and disables the button */
  loading?: boolean;
  /** Label rendered while loading */
  loadingText?: string;
  /** If true, renders an icon with no label */
  iconOnly?: boolean;
  /** Button contents */
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      hierarchy = "primary",
      size = "md",
      iconLeading,
      iconTrailing,
      loading = false,
      loadingText = "Submitting…",
      iconOnly = false,
      className,
      children,
      disabled,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const classes = clsx(
      "button",
      `button--${hierarchy}`,
      `button--${size}`,
      iconOnly && "button--icon-only",
      loading && "button--loading",
      className,
    );

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading ? (
          <>
            <span className="button__spinner" aria-hidden="true" />
            {!iconOnly && <span className="button__label">{loadingText}</span>}
          </>
        ) : (
          <>
            {iconLeading && (
              <span
                className="button__icon button__icon--leading"
                aria-hidden="true"
              >
                {iconLeading}
              </span>
            )}
            {!iconOnly && <span className="button__label">{children}</span>}
            {iconTrailing && (
              <span
                className="button__icon button__icon--trailing"
                aria-hidden="true"
              >
                {iconTrailing}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
