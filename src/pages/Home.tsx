import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/Card/Card";
import { Pill } from "../components/Pill/Pill";
import { Button } from "../components/Button/Button";
import "./home.css";

const SYMPTOMS = [
  "Hot flashes",
  "Brain fog",
  "Night sweats",
  "Insomnia",
  "Mood changes",
  "Fatigue",
] as const;

export default function Home() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(
    new Set(["Hot flashes", "Mood changes", "Fatigue"]),
  );

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) => {
      const next = new Set(prev);
      next.has(symptom) ? next.delete(symptom) : next.add(symptom);
      return next;
    });
  };

  return (
    <div className="showcase">
      <section className="showcase__section">
        <h2 className="showcase__section-title">Card — symptom selector</h2>
        <Card className="showcase__symptom-card">
          <header className="showcase__card-header">
            <p className="showcase__card-title">
              Select the symptoms you're experiencing
            </p>
            <p className="showcase__card-subtitle">Select all that apply</p>
          </header>
          <div className="showcase__card-pills" role="group" aria-label="Symptoms">
            {SYMPTOMS.map((symptom) => (
              <Pill
                key={symptom}
                selected={selectedSymptoms.has(symptom)}
                onToggle={() => toggleSymptom(symptom)}
              >
                {symptom}
              </Pill>
            ))}
          </div>
          <Button hierarchy="primary" className="showcase__card-action">
            Continue
          </Button>
        </Card>
      </section>

      <section className="showcase__section">
        <h2 className="showcase__section-title">Components</h2>
        <div className="home__nav-cards">
          <Link to="/button" className="home__nav-link">
            <Card className="home__nav-card">
              <span className="home__nav-card-label">Button</span>
              <span className="home__nav-card-arrow">→</span>
            </Card>
          </Link>
          <Link to="/pill" className="home__nav-link">
            <Card className="home__nav-card">
              <span className="home__nav-card-label">Pill</span>
              <span className="home__nav-card-arrow">→</span>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
