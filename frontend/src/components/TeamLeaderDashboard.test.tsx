import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamLeaderDashboard from './TeamLeaderDashboard';
import { server } from '../mocks/server';
import { http } from 'msw';

describe('TeamLeaderDashboard', () => {
  it('displays pending tasks correctly', async () => {
    render(<TeamLeaderDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Fix navigation bug')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('3 story points')).toBeInTheDocument();
      expect(screen.getByText('4 hours')).toBeInTheDocument();
    });
  });

  it('allows filtering tasks by developer', async () => {
    server.use(
      http.get('/api/tasks', ({ request }) => {
        const url = new URL(request.url);
        const developer = url.searchParams.get('developer');
        return new Response(
          JSON.stringify([{
            id: 5,
            name: 'UI Improvements',
            developer: developer || 'John Doe',
            storyPoints: 2,
            estimatedHours: 3,
            status: 'pending',
          }])
        );
      })
    );

    render(<TeamLeaderDashboard />);
    
    const developerSelect = screen.getByLabelText(/filter by developer/i);
    await userEvent.selectOptions(developerSelect, 'John Doe');

    await waitFor(() => {
      expect(screen.getByText('UI Improvements')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('allows updating task status', async () => {
    render(<TeamLeaderDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Fix navigation bug')).toBeInTheDocument();
    });

    const statusButton = screen.getByRole('button', { name: /update status/i });
    await userEvent.click(statusButton);

    const statusSelect = screen.getByLabelText(/select status/i);
    await userEvent.selectOptions(statusSelect, 'in-progress');

    await waitFor(() => {
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });

  it('displays empty state when no pending tasks exist', async () => {
    server.use(
      http.get('/api/tasks', () => {
        return new Response(JSON.stringify([]));
      })
    );

    render(<TeamLeaderDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No pending tasks')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    server.use(
      http.get('/api/tasks', () => {
        return new Response(null, { status: 500 });
      })
    );

    render(<TeamLeaderDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading tasks')).toBeInTheDocument();
    });
  });
}); 