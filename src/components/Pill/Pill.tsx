import { clsx } from "clsx";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./pill.scss";

type PillSize = "md";

export interface PillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onToggle"> {
  /** Whether the pill is currently selected */
  selected?: boolean;
  /** Called when the user toggles the pill. Receives the new selected state. */
  onToggle?: (selected: boolean) => void;
  /** Size of the pill. Currently only `md` ships — see notes on sizing. */
  size?: PillSize;
  /** Pill label */
  children: ReactNode;
}

/**
 * Pill (Selectable)
 * Pills let users select from a set of options, such as symptoms, filters,
 * or preferences.
 *
 * Semantics:
 *   - Renders as a <button> with `aria-pressed` to communicate toggle state
 *     to assistive tech. `aria-pressed` (not `aria-selected`) is the correct
 *     attribute for a standalone toggle — `aria-selected` is for items
 *     inside a listbox/tab/grid container.
 *   - `:focus-visible` handles keyboard-only focus rings in the stylesheet.
 */
export const Pill = forwardRef<HTMLButtonElement, PillProps>(
  (
    {
      selected = false,
      onToggle,
      size = "md",
      className,
      children,
      onClick,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onToggle?.(!selected);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={selected}
        className={clsx("pill", `pill--${size}`, selected && "pill--selected", className)}
        onClick={handleClick}
        {...rest}
      >
        <span className="pill__label">{children}</span>
      </button>
    );
  },
);

Pill.displayName = "Pill";
