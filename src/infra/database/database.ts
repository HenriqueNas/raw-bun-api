import { Database } from 'bun:sqlite';

const db = new Database('database.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

const getTasks = () => {
  return db.query('SELECT * FROM tasks').all();
};

const getTask = (id: number) => {
  return db.query('SELECT * FROM tasks WHERE id = ?').get(id);
};

const createTask = (title: string) => {
  const query = db.query('INSERT INTO tasks (title) VALUES (?)');
  const { lastInsertRowid } = query.run(title);

  return db.query('SELECT * FROM tasks WHERE id = ?').get(lastInsertRowid);
};

export { getTasks, getTask, createTask };
