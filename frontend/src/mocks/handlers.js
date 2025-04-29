import { rest } from 'msw';

export const handlers = [
  // Mock GET tasks for a user
  rest.get('/api/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
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
      ])
    );
  }),

  // Mock update task status
  rest.patch('/api/tasks/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: req.params.id,
        ...req.body,
      })
    );
  }),

  // Mock get completed tasks by sprint
  rest.get('/api/tasks/completed', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 3,
          name: 'Design database schema',
          developer: 'John Doe',
          estimatedHours: 6,
          actualHours: 8,
          sprint: 'Sprint 1',
        },
      ])
    );
  }),

  // Mock get team KPIs
  rest.get('/api/kpis/team', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        hoursWorked: 120,
        tasksCompleted: 15,
        period: 'Sprint 1',
      })
    );
  }),

  // Mock get personal KPIs
  rest.get('/api/kpis/personal', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        hoursWorked: 40,
        tasksCompleted: 5,
        period: 'Sprint 1',
      })
    );
  }),
]; 