import type { Todo } from './types';
import { todosStore } from './todos-store';

const tagName = 'todo-item';

export class TodoItemElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['data-id', 'data-title', 'data-completed'];
  }

  private get todoId(): string {
    return this.getAttribute('data-id') ?? '';
  }

  connectedCallback(): void {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.render();
    this.attachListeners();
  }

  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  private render(): void {
    const title = this.getAttribute('data-title') ?? '';
    const completed = this.getAttribute('data-completed') === 'true';
    this.shadowRoot!.innerHTML = `
      <style>
        :host { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem;
          border-bottom: 1px solid var(--border, #2d2822); }
        :host(:last-child) { border-bottom: none; }
        .checkbox { width: 1.25rem; height: 1.25rem; cursor: pointer; accent-color: var(--accent, #e07c4c); }
        .title { flex: 1; font-size: 0.95rem; color: var(--text-primary, #f5efe6); }
        .title.completed { text-decoration: line-through; color: var(--text-muted, #7a6f64); }
        .btn-delete { padding: 0.35rem 0.6rem; font-size: 0.8rem; cursor: pointer;
          background: var(--bg-tertiary, #241f1a); border: 1px solid var(--border); border-radius: 6px;
          color: var(--text-muted); }
        .btn-delete:hover { color: var(--error, #c75c5c); border-color: var(--error); }
      </style>
      <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''} aria-label="Toggle complete" />
      <span class="title ${completed ? 'completed' : ''}">${escapeHtml(title)}</span>
      <button type="button" class="btn-delete" aria-label="Delete">Delete</button>
    `;
  }

  private attachListeners(): void {
    if (!this.shadowRoot) return;
    const checkbox = this.shadowRoot.querySelector('.checkbox');
    const btnDelete = this.shadowRoot.querySelector('.btn-delete');
    checkbox?.addEventListener('change', () => todosStore.toggle(this.todoId));
    btnDelete?.addEventListener('click', () => todosStore.remove(this.todoId));
  }
}

function escapeHtml(s: string): string {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

export function registerTodoItem(): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, TodoItemElement);
  }
}

export function createTodoItemElement(todo: Todo): HTMLElement {
  const el = document.createElement(tagName) as TodoItemElement & HTMLElement;
  el.setAttribute('data-id', todo.id);
  el.setAttribute('data-title', todo.title);
  el.setAttribute('data-completed', String(todo.completed));
  return el;
}
