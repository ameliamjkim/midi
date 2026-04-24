import { clsx } from "clsx";
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import "./card.scss";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...rest }, ref) => (
    <div ref={ref} className={clsx("card", className)} {...rest}>
      {children}
    </div>
  ),
);

Card.displayName = "Card";
