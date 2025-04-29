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

export default function TeamLeaderDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = selectedDeveloper 
          ? `/api/tasks?developer=${selectedDeveloper}`
          : '/api/tasks';
        const response = await axios.get(url);
        setTasks(response.data);
        setError(null);
      } catch (err) {
        setError('Error loading tasks');
      }
    };

    fetchTasks();
  }, [selectedDeveloper]);

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      setError('Error updating task status');
    }
  };

  if (error) return <div>{error}</div>;
  if (tasks.length === 0) return <div>No pending tasks</div>;

  return (
    <div>
      <select 
        value={selectedDeveloper} 
        onChange={(e) => setSelectedDeveloper(e.target.value)}
        aria-label="filter by developer"
      >
        <option value="">All Developers</option>
        <option value="John Doe">John Doe</option>
        <option value="Jane Smith">Jane Smith</option>
      </select>

      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.name}</h3>
          <p>Developer: {task.developer}</p>
          <p>{task.storyPoints} story points</p>
          <p>{task.estimatedHours} hours</p>
          <p>Status: {task.status}</p>
          <button 
            onClick={() => updateTaskStatus(task.id, 'in-progress')}
            aria-label="update status"
          >
            Update Status
          </button>
        </div>
      ))}
    </div>
  );
} 