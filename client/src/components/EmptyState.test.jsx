import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmptyState from './EmptyState';

// EmptyState renders a react-router <Link> when given an action, so tests wrap it
// in a MemoryRouter.
const renderIn = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('EmptyState', () => {
  it('renders the title and hint', () => {
    renderIn(<EmptyState title="No printers yet" hint="Import a CSV to get started" />);
    expect(screen.getByText('No printers yet')).toBeInTheDocument();
    expect(screen.getByText('Import a CSV to get started')).toBeInTheDocument();
  });

  it('omits the hint when not provided', () => {
    renderIn(<EmptyState title="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.queryByText(/get started/i)).toBeNull();
  });

  it('renders an action link to the given route when both label and target are provided', () => {
    renderIn(<EmptyState title="t" actionLabel="Add printer" actionTo="/settings" />);
    expect(screen.getByRole('link', { name: 'Add printer' })).toHaveAttribute('href', '/settings');
  });

  it('renders no link when actionTo is missing (label alone is not enough)', () => {
    renderIn(<EmptyState title="t" actionLabel="Add printer" />);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renders children', () => {
    renderIn(<EmptyState title="t"><span>custom child</span></EmptyState>);
    expect(screen.getByText('custom child')).toBeInTheDocument();
  });
});
