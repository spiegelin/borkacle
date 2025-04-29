import { renderHook, act } from '@testing-library/react';
import { useTaskManagement } from './useTaskManagement';
import { server } from '../mocks/server';
import { http } from 'msw';

describe('useTaskManagement', () => {
  it('fetches tasks successfully', async () => {
    const { result } = renderHook(() => useTaskManagement());

    // Wait for initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('updates task status successfully', async () => {
    const { result } = renderHook(() => useTaskManagement());

    // Wait for initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Update task status
    await act(async () => {
      await result.current.updateTaskStatus(1, 'completed');
    });

    // Verify task was updated
    expect(result.current.tasks.find(task => task.id === 1)?.status).toBe('completed');
  });

  it('handles API errors when fetching tasks', async () => {
    // Override the default handler for this test
    server.use(
      http.get('/api/tasks', () => {
        return new Response(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => useTaskManagement());

    // Wait for initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.tasks).toHaveLength(0);
  });

  it('handles API errors when updating task status', async () => {
    // Override the default handler for this test
    server.use(
      http.patch('/api/tasks/:id', () => {
        return new Response(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => useTaskManagement());

    // Wait for initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Attempt to update task status
    await act(async () => {
      await result.current.updateTaskStatus(1, 'completed');
    });

    expect(result.current.error).toBeTruthy();
  });

  it('filters tasks by status', async () => {
    const { result } = renderHook(() => useTaskManagement());

    // Wait for initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Filter tasks by status
    act(() => {
      result.current.setStatusFilter('pending');
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].status).toBe('pending');
  });
}); 