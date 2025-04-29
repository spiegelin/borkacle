import { render } from '@testing-library/react';
import WorkerDashboard from './WorkerDashboard';

describe('WorkerDashboard Snapshot', () => {
  it('matches snapshot', () => {
    const { container } = render(<WorkerDashboard />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with loading state', () => {
    const { container } = render(<WorkerDashboard isLoading={true} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with error state', () => {
    const { container } = render(<WorkerDashboard error="Failed to load tasks" />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with empty tasks', () => {
    const { container } = render(<WorkerDashboard tasks={[]} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with tasks', () => {
    const tasks = [
      {
        id: 1,
        name: 'Implement login page',
        developer: 'John Doe',
        storyPoints: 5,
        estimatedHours: 8,
        status: 'in-progress',
      },
      {
        id: 2,
        name: 'Fix navigation bug',
        developer: 'Jane Smith',
        storyPoints: 3,
        estimatedHours: 4,
        status: 'pending',
      },
    ];
    const { container } = render(<WorkerDashboard tasks={tasks} />);
    expect(container).toMatchSnapshot();
  });
}); 