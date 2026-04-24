import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Pill } from './Pill';

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

describe('Pill – rendering', () => {
  it('renders its label', () => {
    render(<Pill>Cardiology</Pill>);
    expect(screen.getByRole('button', { name: 'Cardiology' })).toBeInTheDocument();
  });

  it('defaults to type="button" to avoid accidental form submission', () => {
    render(<Pill>Cardiology</Pill>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('forwards extra HTML attributes to the underlying <button>', () => {
    render(<Pill data-custom="yes">Cardiology</Pill>);
    expect(screen.getByRole('button')).toHaveAttribute('data-custom', 'yes');
  });

  it('forwards a ref to the <button> element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Pill ref={ref}>Cardiology</Pill>);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('merges a custom className without clobbering built-in classes', () => {
    render(<Pill className="extra">Cardiology</Pill>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('pill');
    expect(btn).toHaveClass('extra');
  });

  it('wraps the label text in a pill__label span', () => {
    render(<Pill>Cardiology</Pill>);
    const btn = screen.getByRole('button');
    const label = btn.querySelector('.pill__label');
    expect(label).toHaveTextContent('Cardiology');
  });
});

// ---------------------------------------------------------------------------
// Size variants
// ---------------------------------------------------------------------------

describe('Pill – size variants', () => {
  it('applies class pill--md for the default size', () => {
    render(<Pill>Cardiology</Pill>);
    expect(screen.getByRole('button')).toHaveClass('pill--md');
  });

  it('applies class pill--md when size="md" is set explicitly', () => {
    render(<Pill size="md">Cardiology</Pill>);
    expect(screen.getByRole('button')).toHaveClass('pill--md');
  });
});

// ---------------------------------------------------------------------------
// Selected state
// ---------------------------------------------------------------------------

describe('Pill – selected state', () => {
  it('is unselected by default (aria-pressed="false")', () => {
    render(<Pill>Cardiology</Pill>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('reflects selected=true via aria-pressed="true"', () => {
    render(<Pill selected>Cardiology</Pill>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('applies pill--selected class when selected=true', () => {
    render(<Pill selected>Cardiology</Pill>);
    expect(screen.getByRole('button')).toHaveClass('pill--selected');
  });

  it('does not apply pill--selected class when selected=false', () => {
    render(<Pill selected={false}>Cardiology</Pill>);
    expect(screen.getByRole('button')).not.toHaveClass('pill--selected');
  });
});

// ---------------------------------------------------------------------------
// Interaction – onToggle
// ---------------------------------------------------------------------------

describe('Pill – onToggle', () => {
  it('calls onToggle with true when an unselected pill is clicked', async () => {
    const onToggle = vi.fn();
    render(<Pill onToggle={onToggle}>Cardiology</Pill>);
    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('calls onToggle with false when a selected pill is clicked', async () => {
    const onToggle = vi.fn();
    render(<Pill selected onToggle={onToggle}>Cardiology</Pill>);
    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('calls onToggle exactly once per click', async () => {
    const onToggle = vi.fn();
    render(<Pill onToggle={onToggle}>Cardiology</Pill>);
    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('also fires a native onClick handler alongside onToggle', async () => {
    const onToggle = vi.fn();
    const onClick = vi.fn();
    render(<Pill onToggle={onToggle} onClick={onClick}>Cardiology</Pill>);
    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw when onToggle is not provided', async () => {
    render(<Pill>Cardiology</Pill>);
    await expect(userEvent.click(screen.getByRole('button'))).resolves.not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Interaction – keyboard
// ---------------------------------------------------------------------------

describe('Pill – keyboard interaction', () => {
  it('is activatable via Space', async () => {
    const onToggle = vi.fn();
    render(<Pill onToggle={onToggle}>Cardiology</Pill>);
    screen.getByRole('button').focus();
    await userEvent.keyboard(' ');
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it('is activatable via Enter', async () => {
    const onToggle = vi.fn();
    render(<Pill onToggle={onToggle}>Cardiology</Pill>);
    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});

// ---------------------------------------------------------------------------
// Disabled state
// ---------------------------------------------------------------------------

describe('Pill – disabled state', () => {
  it('is disabled when disabled=true is passed', () => {
    render(<Pill disabled>Cardiology</Pill>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onToggle when disabled', async () => {
    const onToggle = vi.fn();
    render(<Pill disabled onToggle={onToggle}>Cardiology</Pill>);
    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe('Pill – accessibility', () => {
  it('has no axe violations – unselected', async () => {
    const { container } = render(<Pill>Cardiology</Pill>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations – selected', async () => {
    const { container } = render(<Pill selected>Cardiology</Pill>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations – disabled', async () => {
    const { container } = render(<Pill disabled>Cardiology</Pill>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses aria-pressed (not aria-selected) to communicate toggle state', () => {
    render(<Pill selected>Cardiology</Pill>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed');
    expect(btn).not.toHaveAttribute('aria-selected');
  });

  it('is discoverable as a button by assistive technologies', () => {
    render(<Pill>Cardiology</Pill>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has an accessible name derived from its text content', () => {
    render(<Pill>Neurology</Pill>);
    expect(screen.getByRole('button', { name: 'Neurology' })).toBeInTheDocument();
  });

  it('has no axe violations – multiple pills in a group', async () => {
    const { container } = render(
      <div role="group" aria-label="Specialties">
        <Pill>Cardiology</Pill>
        <Pill selected>Neurology</Pill>
        <Pill disabled>Oncology</Pill>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
