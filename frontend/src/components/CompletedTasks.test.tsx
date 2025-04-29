import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CompletedTasks from './CompletedTasks';
import { server } from '../mocks/server';
import { http } from 'msw';

describe('CompletedTasks', () => {
  it('displays completed tasks with required information', async () => {
    render(<CompletedTasks />);
    
    await waitFor(() => {
      expect(screen.getByText('Design database schema')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('6 hours estimated')).toBeInTheDocument();
      expect(screen.getByText('8 hours actual')).toBeInTheDocument();
      expect(screen.getByText('Sprint 1')).toBeInTheDocument();
    });
  });

  it('filters completed tasks by sprint', async () => {
    server.use(
      http.get('/api/tasks/completed', ({ request }) => {
        const url = new URL(request.url);
        const sprint = url.searchParams.get('sprint');
        return new Response(
          JSON.stringify([
            {
              id: 4,
              name: 'API Integration',
              developer: 'Jane Smith',
              estimatedHours: 10,
              actualHours: 12,
              sprint: sprint || 'Sprint 1',
            },
          ])
        );
      })
    );

    render(<CompletedTasks />);
    
    const sprintSelect = screen.getByLabelText(/select sprint/i);
    await userEvent.selectOptions(sprintSelect, 'Sprint 2');

    await waitFor(() => {
      expect(screen.getByText('API Integration')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('10 hours estimated')).toBeInTheDocument();
      expect(screen.getByText('12 hours actual')).toBeInTheDocument();
    });
  });

  it('displays empty state when no tasks are completed', async () => {
    server.use(
      http.get('/api/tasks/completed', () => {
        return new Response(JSON.stringify([]));
      })
    );

    render(<CompletedTasks />);
    
    await waitFor(() => {
      expect(screen.getByText('No completed tasks found')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    server.use(
      http.get('/api/tasks/completed', () => {
        return new Response(null, { status: 500 });
      })
    );

    render(<CompletedTasks />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading completed tasks')).toBeInTheDocument();
    });
  });
}); 