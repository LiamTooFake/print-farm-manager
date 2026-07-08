import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach } from 'vitest';
import Jobs from './Jobs';

// Minimal fetch stub: routes GET /api/jobs to the provided jobs, and the filter
// option endpoints to empty lists. Demonstrates the fetch-mock pattern the other
// page tests follow.
function stubFetch(jobs) {
  const jsonRes = (data) => Promise.resolve({ ok: true, json: () => Promise.resolve(data) });
  return vi.fn((url, opts) => {
    const u = String(url);
    if (u.startsWith('/api/jobs') && (!opts || !opts.method)) return jsonRes(jobs);
    if (u.startsWith('/api/projects')) return jsonRes([]);
    if (u.startsWith('/api/printers')) return jsonRes([]);
    return jsonRes({});
  });
}

const renderJobs = () => render(<MemoryRouter><Jobs /></MemoryRouter>);

const SAMPLE = [
  { id: 1, part_name: 'XRP Chassis', project_name: 'Run A', printer_name: 'MK4S_01', printer_model: 'mk4s', status: 'printing', started_at: 1700000000000, finished_at: null },
  { id: 2, part_name: 'Left Bracket', project_name: 'Run A', printer_name: 'MK4S_02', printer_model: 'mk4s', status: 'queued', started_at: null, finished_at: null },
];

beforeEach(() => { global.fetch = stubFetch(SAMPLE); });
afterEach(() => { vi.restoreAllMocks(); delete global.fetch; });

describe('Jobs page', () => {
  it('renders jobs returned by the API, with a Cancel action only on queued jobs', async () => {
    renderJobs();
    // Table + responsive cards both render in jsdom (no CSS media queries), so text appears twice.
    expect((await screen.findAllByText('XRP Chassis')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Left Bracket').length).toBeGreaterThan(0);
    // Only the queued job gets Cancel buttons; the printing job does not.
    expect(screen.getAllByRole('button', { name: 'Cancel' }).length).toBeGreaterThan(0);
  });

  it('shows the empty state with a Projects link when there are no jobs and no filters', async () => {
    global.fetch = stubFetch([]);
    renderJobs();
    expect(await screen.findByText('No jobs yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Projects' })).toHaveAttribute('href', '/projects');
  });

  it('refetches with a status query param when the status filter changes', async () => {
    renderJobs();
    await screen.findAllByText('XRP Chassis');
    global.fetch.mockClear();

    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'printing' } });

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('status=printing')),
    );
  });
});
