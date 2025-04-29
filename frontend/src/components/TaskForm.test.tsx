import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';
import { server } from '../mocks/server';
import { rest } from 'msw';

describe('TaskForm', () => {
  it('submits a new task successfully', async () => {
    render(<TaskForm />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/task name/i), 'New Feature Implementation');
    await userEvent.type(screen.getByLabelText(/developer/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/story points/i), '5');
    await userEvent.type(screen.getByLabelText(/estimated hours/i), '8');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Task created successfully')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<TaskForm />);
    
    // Try to submit without filling required fields
    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    // Verify validation messages
    expect(screen.getByText('Task name is required')).toBeInTheDocument();
    expect(screen.getByText('Developer is required')).toBeInTheDocument();
    expect(screen.getByText('Story points are required')).toBeInTheDocument();
    expect(screen.getByText('Estimated hours are required')).toBeInTheDocument();
  });

  it('handles API errors during submission', async () => {
    // Override the default handler for this test
    server.use(
      rest.post('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<TaskForm />);
    
    // Fill out the form
    await userEvent.type(screen.getByLabelText(/task name/i), 'New Feature Implementation');
    await userEvent.type(screen.getByLabelText(/developer/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/story points/i), '5');
    await userEvent.type(screen.getByLabelText(/estimated hours/i), '8');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText('Error creating task')).toBeInTheDocument();
    });
  });

  it('updates an existing task', async () => {
    const task = {
      id: 1,
      name: 'Existing Task',
      developer: 'John Doe',
      storyPoints: 3,
      estimatedHours: 4,
    };

    render(<TaskForm task={task} />);
    
    // Verify form is pre-filled with task data
    expect(screen.getByLabelText(/task name/i)).toHaveValue('Existing Task');
    expect(screen.getByLabelText(/developer/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/story points/i)).toHaveValue('3');
    expect(screen.getByLabelText(/estimated hours/i)).toHaveValue('4');

    // Update task name
    await userEvent.clear(screen.getByLabelText(/task name/i));
    await userEvent.type(screen.getByLabelText(/task name/i), 'Updated Task Name');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /update task/i }));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Task updated successfully')).toBeInTheDocument();
    });
  });

  it('validates numeric fields', async () => {
    render(<TaskForm />);
    
    // Fill out the form with invalid numeric values
    await userEvent.type(screen.getByLabelText(/task name/i), 'New Task');
    await userEvent.type(screen.getByLabelText(/developer/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/story points/i), 'abc');
    await userEvent.type(screen.getByLabelText(/estimated hours/i), 'xyz');

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /create task/i }));

    // Verify validation messages
    expect(screen.getByText('Story points must be a number')).toBeInTheDocument();
    expect(screen.getByText('Estimated hours must be a number')).toBeInTheDocument();
  });
}); 