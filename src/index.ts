import { serve } from 'bun';

import { getTask, getTasks, createTask } from './infra/database/database';

const server = serve({
  port: 3000,
  routes: {
    '/health': () => new Response('ok'),
    '/tasks': {
      GET: () => {
        return new Response(JSON.stringify(getTasks()), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      },
      POST: async (req) => {
        const task: Task = (await req.json()) as any;

        if (!task.title) {
          return new Response('Title is required', { status: 400 });
        }

        const queryResult = createTask(task.title);
        return new Response(JSON.stringify(queryResult), {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 201,
        });
      },
    },
    '/tasks/:id': (req) => {
      const id = parseInt(req.params.id);
      const task = getTask(id);

      if (!task) return new Response('Task not found', { status: 404 });

      return new Response(JSON.stringify(task), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  },
  fetch(_) {
    return new Response('Not Found', { status: 404 });
  },
  error(error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  },
});

console.log(`Server is running on http://localhost:${server.port}`);

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
};
