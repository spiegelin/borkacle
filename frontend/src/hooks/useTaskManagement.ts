import { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  name: string;
  developer: string;
  storyPoints: number;
  estimatedHours: number;
  status: string;
}

export function useTaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        setTasks(response.data);
        setError(null);
      } catch (err) {
        setError('Error fetching tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      setError(null);
    } catch (err) {
      setError('Error updating task status');
    }
  };

  const filteredTasks = statusFilter 
    ? tasks.filter(task => task.status === statusFilter)
    : tasks;

  return {
    tasks,
    filteredTasks,
    isLoading,
    error,
    updateTaskStatus,
    setStatusFilter
  };
} 