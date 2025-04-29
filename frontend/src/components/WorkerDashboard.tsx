import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTaskManagement } from '../hooks/useTaskManagement';

interface WorkerDashboardProps {
  isLoading?: boolean;
  error?: string;
  tasks?: Array<{
    id: number;
    name: string;
    developer: string;
    storyPoints: number;
    estimatedHours: number;
    status: string;
  }>;
}

export default function WorkerDashboard({ isLoading: propIsLoading, error: propError, tasks: propTasks }: WorkerDashboardProps = {}) {
  const { tasks, isLoading, error, updateTaskStatus } = useTaskManagement();
  const displayTasks = propTasks || tasks;
  const displayIsLoading = propIsLoading ?? isLoading;
  const displayError = propError || error;

  if (displayIsLoading) return <div>Loading...</div>;
  if (displayError) return <div>{displayError}</div>;
  if (!displayTasks.length) return <div>No tasks assigned</div>;

  return (
    <div>
      {displayTasks.map(task => (
        <div key={task.id}>
          <h3>{task.name}</h3>
          <p>Developer: {task.developer}</p>
          <p>{task.storyPoints} story points</p>
          <p>{task.estimatedHours} hours</p>
          <p>Status: {task.status}</p>
          <button 
            onClick={() => updateTaskStatus(task.id, 'completed')}
            aria-label="complete task"
          >
            Complete Task
          </button>
        </div>
      ))}
    </div>
  );
} 