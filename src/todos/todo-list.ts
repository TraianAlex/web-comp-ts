import type { Todo } from './types';
import { todosStore } from './todos-store';
import { registerTodoItem, createTodoItemElement } from './todo-item';

const tagName = 'todo-list';

export type FilterType = 'all' | 'active' | 'completed';

export class TodoListElement extends HTMLElement {
  private filter: FilterType = 'all';
  private unsubscribe: (() => void) | null = null;

  static get observedAttributes(): string[] {
    return ['data-filter'];
  }

  connectedCallback(): void {
    registerTodoItem();
    this.attachShadow({ mode: 'open' });
    this.filter = (this.getAttribute('data-filter') as FilterType) || 'all';
    this.render();
    this.unsubscribe = todosStore.subscribe(() => this.render());
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (name === 'data-filter' && value) this.filter = value as FilterType;
    if (this.isConnected) this.render();
  }

  private render(): void {
    if (!this.shadowRoot) return;
    const todos = todosStore.getFiltered(this.filter);
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .list { list-style: none; margin: 0; padding: 0; background: var(--bg-secondary, #1a1612);
          border: 1px solid var(--border, #2d2822); border-radius: 8px; overflow: hidden; }
        .empty { padding: 1.5rem; text-align: center; color: var(--text-muted, #7a6f64); font-size: 0.9rem; }
      </style>
      <ul class="list" role="list">
        ${todos.length === 0 ? '<li class="empty">No items</li>' : ''}
      </ul>
    `;
    const list = this.shadowRoot.querySelector('.list');
    if (list && todos.length > 0) {
      todos.forEach((todo) => {
        const li = document.createElement('li');
        li.appendChild(createTodoItemElement(todo));
        list.appendChild(li);
      });
    }
  }
}

export function registerTodoList(): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, TodoListElement);
  }
}
