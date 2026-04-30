import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

const StarIcon = () => <svg data-testid="star-icon" aria-hidden="true" />;

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('Button – rendering', () => {
  it('renders its label', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('defaults to type="button" to avoid accidental form submission', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('forwards extra HTML attributes to the underlying <button>', () => {
    render(<Button data-custom="yes">Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-custom', 'yes');
  });

  it('forwards a ref to the <button> element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('merges a custom className without clobbering variant classes', () => {
    render(<Button className="extra">Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('button--primary');
    expect(btn).toHaveClass('extra');
  });
});

// ---------------------------------------------------------------------------
// Hierarchy variants
// ---------------------------------------------------------------------------

describe('Button – hierarchy variants', () => {
  const hierarchies = [
    'primary',
    'secondary',
    'tertiary',
    'link-color',
    'link-gray',
  ] as const;

  it.each(hierarchies)('applies class button--%s for hierarchy="%s"', (h) => {
    render(<Button hierarchy={h}>Label</Button>);
    expect(screen.getByRole('button')).toHaveClass(`button--${h}`);
  });

  it('defaults to hierarchy="primary"', () => {
    render(<Button>Label</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--primary');
  });
});

// ---------------------------------------------------------------------------
// Size variants
// ---------------------------------------------------------------------------

describe('Button – size variants', () => {
  const sizes = ['sm', 'md', 'lg', 'xl'] as const;

  it.each(sizes)('applies class button--%s for size="%s"', (s) => {
    render(<Button size={s}>Label</Button>);
    expect(screen.getByRole('button')).toHaveClass(`button--${s}`);
  });

  it('defaults to size="md"', () => {
    render(<Button>Label</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--md');
  });
});

// ---------------------------------------------------------------------------
// Icon slots
// ---------------------------------------------------------------------------

describe('Button – icon slots', () => {
  it('renders a leading icon', () => {
    render(<Button iconLeading={<StarIcon />}>Label</Button>);
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('button--primary');
  });

  it('renders a trailing icon', () => {
    render(<Button iconTrailing={<StarIcon />}>Label</Button>);
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('renders both leading and trailing icons simultaneously', () => {
    render(
      <Button iconLeading={<StarIcon />} iconTrailing={<StarIcon />}>
        Label
      </Button>,
    );
    expect(screen.getAllByTestId('star-icon')).toHaveLength(2);
  });

  it('hides icon wrappers from the a11y tree (aria-hidden)', () => {
    render(<Button iconLeading={<StarIcon />}>Label</Button>);
    const wrapper = screen.getByTestId('star-icon').closest('span');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });
});

// ---------------------------------------------------------------------------
// Icon-only variant
// ---------------------------------------------------------------------------

describe('Button – iconOnly variant', () => {
  it('applies button--icon-only class', () => {
    render(
      <Button iconOnly iconLeading={<StarIcon />} aria-label="Save">
        Save
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('button--icon-only');
  });

  it('does not render the label span when iconOnly=true', () => {
    render(
      <Button iconOnly iconLeading={<StarIcon />} aria-label="Save">
        Save
      </Button>,
    );
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

describe('Button – loading state', () => {
  it('applies button--loading class', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--loading');
  });

  it('is disabled while loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('sets aria-busy="true" while loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('shows the default loadingText', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByText('Submitting…')).toBeInTheDocument();
  });

  it('shows a custom loadingText when provided', () => {
    render(<Button loading loadingText="Please wait…">Save</Button>);
    expect(screen.getByText('Please wait…')).toBeInTheDocument();
  });

  it('hides the original children while loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('does not set aria-busy when not loading', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
  });

  it('renders the spinner element while loading', () => {
    render(<Button loading>Save</Button>);
    // Spinner is aria-hidden, query via class
    const btn = screen.getByRole('button');
    expect(btn.querySelector('.button__spinner')).toBeInTheDocument();
  });

  it('hides the spinner element from the a11y tree', () => {
    render(<Button loading>Save</Button>);
    const spinner = screen.getByRole('button').querySelector('.button__spinner');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });
});

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------

describe('Button – disabled state', () => {
  it('is disabled when disabled=true', () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Interaction
// ---------------------------------------------------------------------------

describe('Button – interaction', () => {
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick while loading', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is keyboard-activatable via Space', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    screen.getByRole('button').focus();
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is keyboard-activatable via Enter', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe('Button – accessibility', () => {
  it('has no axe violations – default primary', async () => {
    const { container } = render(<Button>Save</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it.each(['secondary', 'tertiary', 'link-color', 'link-gray'] as const)(
    'has no axe violations – hierarchy="%s"',
    async (h) => {
      const { container } = render(<Button hierarchy={h}>Save</Button>);
      expect(await axe(container)).toHaveNoViolations();
    },
  );

  it.each(['sm', 'md', 'lg', 'xl'] as const)(
    'has no axe violations – size="%s"',
    async (s) => {
      const { container } = render(<Button size={s}>Save</Button>);
      expect(await axe(container)).toHaveNoViolations();
    },
  );

  it('has no axe violations – loading state', async () => {
    const { container } = render(<Button loading>Save</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations – disabled state', async () => {
    const { container } = render(<Button disabled>Save</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations – icon-only with aria-label', async () => {
    const { container } = render(
      <Button iconOnly iconLeading={<StarIcon />} aria-label="Favourite">
        Favourite
      </Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations – leading + trailing icons', async () => {
    const { container } = render(
      <Button iconLeading={<StarIcon />} iconTrailing={<StarIcon />}>
        Save
      </Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
