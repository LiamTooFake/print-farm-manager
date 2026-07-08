import { render, act } from '@testing-library/react';
import { vi } from 'vitest';
import PollTimer from './PollTimer';

// PollTimer drives a countdown ring off Date.now() and a 500ms interval, so these
// tests use fake timers and advance the clock inside act() to flush state updates.
describe('PollTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders an svg with a track circle and a progress circle', () => {
    const { container } = render(<PollTimer lastPolled={Date.now()} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });

  it('advances the countdown and reflects elapsed seconds in the title', () => {
    const { container } = render(<PollTimer lastPolled={Date.now()} intervalMs={15000} />);
    expect(container.querySelector('svg')).toHaveAttribute('title', 'Last refresh 0s ago');

    act(() => vi.advanceTimersByTime(6000));
    expect(container.querySelector('svg')).toHaveAttribute('title', 'Last refresh 6s ago');
  });

  it('clamps the ring once the full interval has elapsed (dashoffset reaches 0)', () => {
    const { container } = render(<PollTimer lastPolled={Date.now()} intervalMs={5000} size={20} />);
    act(() => vi.advanceTimersByTime(10000)); // well past the interval
    const progressRing = container.querySelectorAll('circle')[1];
    expect(Number(progressRing.getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 5);
  });

  it('stays at zero elapsed when lastPolled is null (nothing polled yet)', () => {
    const { container } = render(<PollTimer lastPolled={null} />);
    act(() => vi.advanceTimersByTime(9000));
    expect(container.querySelector('svg')).toHaveAttribute('title', 'Last refresh 0s ago');
  });
});
