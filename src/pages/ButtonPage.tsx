import { Link } from "react-router-dom";
import { Button } from "../components/Button/Button";
import "./component-page.css";

const CircleIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ICON_ONLY_HIERARCHIES = [
  "primary",
  "secondary",
  "tertiary",
] as const;

const HIERARCHIES = [
  "primary",
  "secondary",
  "tertiary",
  "link-color",
  "link-gray",
] as const;

const SIZES = ["sm", "md", "lg", "xl"] as const;

export default function ButtonPage() {
  return (
    <div className="showcase">
      <Link to="/" className="component-page__back">← Back</Link>

      <section className="showcase__section">
        <h2 className="showcase__section-title">Button — hierarchy, md</h2>
        <div className="showcase__row">
          {HIERARCHIES.map((h) => (
            <div key={h}>
              <Button hierarchy={h}>
                {h.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="showcase__section">
        <h2 className="showcase__section-title">Button — size, primary</h2>
        <div className="showcase__row showcase__row--align-center">
          {SIZES.map((s) => (
            <Button key={s} hierarchy="primary" size={s}>
              Button CTA
            </Button>
          ))}
        </div>
      </section>

      <section className="showcase__section">
        <h2 className="showcase__section-title">Button — states, primary md</h2>
        <div className="showcase__row">
          <Button hierarchy="primary">Default</Button>
          <Button hierarchy="primary" disabled>Disabled</Button>
          <Button hierarchy="primary" loading loadingText="Loading…" />
        </div>
      </section>

      <section className="showcase__section">
        <h2 className="showcase__section-title">Button — states, secondary md</h2>
        <div className="showcase__row">
          <Button hierarchy="secondary">Default</Button>
          <Button hierarchy="secondary" disabled>Disabled</Button>
          <Button hierarchy="secondary" loading loadingText="Loading…" />
        </div>
      </section>

      <section className="showcase__section">
        <h2 className="showcase__section-title">Button — states, tertiary md</h2>
        <div className="showcase__row">
          <Button hierarchy="tertiary">Default</Button>
          <Button hierarchy="tertiary" disabled>Disabled</Button>
          <Button hierarchy="tertiary" loading loadingText="Loading…" />
        </div>
      </section>

      <section className="showcase__section">
        <h2 className="showcase__section-title">Button — link variants</h2>
        <div className="showcase__row">
          <Button hierarchy="link-color">Link color</Button>
          <Button hierarchy="link-color" disabled>Disabled</Button>
          <Button hierarchy="link-gray">Link gray</Button>
          <Button hierarchy="link-gray" disabled>Disabled</Button>
        </div>
      </section>

      <section className="showcase__section">
        <h2 className="showcase__section-title">Button — icon only, all sizes</h2>
        {ICON_ONLY_HIERARCHIES.map((h) => (
          <div key={h} className="showcase__stack">
            <div className="showcase__row showcase__row--align-center">
              {SIZES.map((s) => (
                <Button
                  key={s}
                  hierarchy={h}
                  size={s}
                  iconOnly
                  iconLeading={<CircleIcon />}
                  aria-label="Add"
                />
              ))}
            </div>
            <div className="showcase__row showcase__row--align-center">
              {SIZES.map((s) => (
                <Button
                  key={s}
                  hierarchy={h}
                  size={s}
                  iconOnly
                  iconLeading={<CircleIcon />}
                  disabled
                  aria-label="Add"
                />
              ))}
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}
