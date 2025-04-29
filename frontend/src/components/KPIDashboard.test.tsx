import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KPIDashboard from './KPIDashboard';
import { server } from '../mocks/server';
import { http } from 'msw';

describe('KPIDashboard', () => {
  it('displays team KPIs correctly', async () => {
    render(<KPIDashboard />);
    
    // Switch to team view
    const teamTab = screen.getByRole('tab', { name: /team/i });
    await userEvent.click(teamTab);

    // Verify team KPIs are displayed
    await waitFor(() => {
      expect(screen.getByText('120 hours worked')).toBeInTheDocument();
      expect(screen.getByText('15 tasks completed')).toBeInTheDocument();
      expect(screen.getByText('Sprint 1')).toBeInTheDocument();
    });
  });

  it('displays personal KPIs correctly', async () => {
    render(<KPIDashboard />);
    
    // Switch to personal view
    const personalTab = screen.getByRole('tab', { name: /personal/i });
    await userEvent.click(personalTab);

    // Verify personal KPIs are displayed
    await waitFor(() => {
      expect(screen.getByText('40 hours worked')).toBeInTheDocument();
      expect(screen.getByText('5 tasks completed')).toBeInTheDocument();
      expect(screen.getByText('Sprint 1')).toBeInTheDocument();
    });
  });

  it('updates KPIs when changing sprint period', async () => {
    // Override the default handler for this test
    server.use(
      http.get('/api/kpis/team', () => {
        return new Response(
          JSON.stringify({
            hoursWorked: 150,
            tasksCompleted: 20,
            period: 'Sprint 2',
          })
        );
      })
    );

    render(<KPIDashboard />);
    
    // Select a different sprint
    const sprintSelect = screen.getByLabelText(/select sprint/i);
    await userEvent.selectOptions(sprintSelect, 'Sprint 2');

    // Verify updated KPIs are displayed
    await waitFor(() => {
      expect(screen.getByText('150 hours worked')).toBeInTheDocument();
      expect(screen.getByText('20 tasks completed')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Override the default handler for this test
    server.use(
      http.get('/api/kpis/team', () => {
        return new Response(null, { status: 500 });
      })
    );

    render(<KPIDashboard />);
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Error loading KPIs')).toBeInTheDocument();
    });
  });
}); 