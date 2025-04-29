import { useState, useEffect } from 'react';
import axios from 'axios';

interface KPI {
  hoursWorked: number;
  tasksCompleted: number;
  period: string;
}

export default function KPIDashboard() {
  const [activeTab, setActiveTab] = useState<'team' | 'personal'>('team');
  const [selectedSprint, setSelectedSprint] = useState('Sprint 1');
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const endpoint = activeTab === 'team' ? '/api/kpis/team' : '/api/kpis/personal';
        const response = await axios.get(`${endpoint}?sprint=${selectedSprint}`);
        setKpis(response.data);
        setError(null);
      } catch (err) {
        setError('Error loading KPIs');
      }
    };

    fetchKPIs();
  }, [activeTab, selectedSprint]);

  if (error) return <div>{error}</div>;
  if (!kpis) return <div>Loading...</div>;

  return (
    <div>
      <div role="tablist">
        <button 
          role="tab" 
          onClick={() => setActiveTab('team')}
          aria-selected={activeTab === 'team'}
        >
          Team
        </button>
        <button 
          role="tab" 
          onClick={() => setActiveTab('personal')}
          aria-selected={activeTab === 'personal'}
        >
          Personal
        </button>
      </div>

      <select 
        value={selectedSprint} 
        onChange={(e) => setSelectedSprint(e.target.value)}
        aria-label="select sprint"
      >
        <option value="Sprint 1">Sprint 1</option>
        <option value="Sprint 2">Sprint 2</option>
      </select>

      <div>
        <p>{kpis.hoursWorked} hours worked</p>
        <p>{kpis.tasksCompleted} tasks completed</p>
        <p>{kpis.period}</p>
      </div>
    </div>
  );
} 