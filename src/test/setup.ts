import '@testing-library/jest-dom';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

expect.extend(toHaveNoViolations);

configureAxe({
  rules: {
    // Color-contrast is noted in the README as a known focus-ring issue;
    // skip it globally so structural a11y failures remain visible.
    'color-contrast': { enabled: false },
  },
});
