import { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  name: string;
  developer: string;
  estimatedHours: number;
  actualHours: number;
  sprint: string;
}

export default function CompletedTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSprint, setSelectedSprint] = useState('Sprint 1');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`/api/tasks/completed?sprint=${selectedSprint}`);
        setTasks(response.data);
        setError(null);
      } catch (err) {
        setError('Error loading completed tasks');
      }
    };

    fetchTasks();
  }, [selectedSprint]);

  if (error) return <div>{error}</div>;
  if (tasks.length === 0) return <div>No completed tasks found</div>;

  return (
    <div>
      <select 
        value={selectedSprint} 
        onChange={(e) => setSelectedSprint(e.target.value)}
        aria-label="select sprint"
      >
        <option value="Sprint 1">Sprint 1</option>
        <option value="Sprint 2">Sprint 2</option>
      </select>

      <div>
        {tasks.map(task => (
          <div key={task.id}>
            <h3>{task.name}</h3>
            <p>Developer: {task.developer}</p>
            <p>{task.estimatedHours} hours estimated</p>
            <p>{task.actualHours} hours actual</p>
            <p>{task.sprint}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 