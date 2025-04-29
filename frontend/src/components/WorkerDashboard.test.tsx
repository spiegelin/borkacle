import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkerDashboard from './WorkerDashboard';
import { server } from '../mocks/server';
import { http } from 'msw';

describe('WorkerDashboard', () => {
  it('displays tasks assigned to the user', async () => {
    render(<WorkerDashboard />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Implement login page')).toBeInTheDocument();
      expect(screen.getByText('Fix navigation bug')).toBeInTheDocument();
    });
  });

  it('allows marking a task as completed', async () => {
    render(<WorkerDashboard />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Implement login page')).toBeInTheDocument();
    });

    // Find and click the complete button for the first task
    const completeButton = screen.getByRole('button', { name: /complete task/i });
    await userEvent.click(completeButton);

    // Verify the task status was updated
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  it('displays task details correctly', async () => {
    render(<WorkerDashboard />);
    
    await waitFor(() => {
      const task = screen.getByText('Implement login page');
      expect(task).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('5 story points')).toBeInTheDocument();
      expect(screen.getByText('8 hours')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Override the default handler for this test
    server.use(
      http.get('/api/tasks', () => {
        return new Response(null, { status: 500 });
      })
    );

    render(<WorkerDashboard />);
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Error loading tasks')).toBeInTheDocument();
    });
  });
}); 