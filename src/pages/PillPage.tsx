import { useState } from "react";
import { Link } from "react-router-dom";
import { Pill } from "../components/Pill/Pill";
import "./component-page.css";

const ALL_PILLS = [
  "Hot flashes",
  "Brain fog",
  "Night sweats",
  "Insomnia",
  "Mood changes",
  "Fatigue",
];

export default function PillPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["Hot flashes"]));

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  return (
    <div className="showcase">
      <Link to="/" className="component-page__back">← Back</Link>

      <section className="showcase__section">
        <h2 className="showcase__section-title">Pill — states</h2>
        <div className="showcase__row">
          <Pill selected>Selected</Pill>
          <Pill>Unselected</Pill>
        </div>
      </section>

      <section className="showcase__section">
        <h2 className="showcase__section-title">Pill — interactive</h2>
        <div className="showcase__row">
          {ALL_PILLS.map((label) => (
            <Pill key={label} selected={selected.has(label)} onToggle={() => toggle(label)}>
              {label}
            </Pill>
          ))}
        </div>
      </section>
    </div>
  );
}
