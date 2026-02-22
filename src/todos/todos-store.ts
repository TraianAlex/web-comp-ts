import type { Todo } from './types';

const STORAGE_KEY = 'web-comp-todos';

function generateId(): string {
  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Todo[];
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {
    // ignore
  }
  return [];
}

function saveToStorage(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // ignore
  }
}

class TodosStore {
  private todos: Todo[] = loadFromStorage();
  private listeners: Set<() => void> = new Set();

  private notify(): void {
    saveToStorage(this.todos);
    this.listeners.forEach((fn) => fn());
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  getAll(): Todo[] {
    return [...this.todos];
  }

  getFiltered(filter: 'all' | 'active' | 'completed'): Todo[] {
    switch (filter) {
      case 'active':
        return this.todos.filter((t) => !t.completed);
      case 'completed':
        return this.todos.filter((t) => t.completed);
      default:
        return [...this.todos];
    }
  }

  add(title: string): Todo {
    const todo: Todo = {
      id: generateId(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    this.todos.push(todo);
    this.notify();
    return todo;
  }

  remove(id: string): void {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.notify();
  }

  update(id: string, updates: Partial<Pick<Todo, 'title' | 'completed'>>): void {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) return;
    this.todos[index] = { ...this.todos[index], ...updates };
    this.notify();
  }

  toggle(id: string): void {
    const t = this.todos.find((x) => x.id === id);
    if (t) this.update(id, { completed: !t.completed });
  }

  clearCompleted(): void {
    this.todos = this.todos.filter((t) => !t.completed);
    this.notify();
  }
}

export const todosStore = new TodosStore();
