import { registerTodoInput } from './todo-input';
import { registerTodoList } from './todo-list';
import { todosStore } from './todos-store';

const tagName = 'todo-app';

export type FilterType = 'all' | 'active' | 'completed';

export class TodoAppElement extends HTMLElement {
  private filter: FilterType = 'all';

  connectedCallback(): void {
    registerTodoInput();
    registerTodoList();
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    todosStore.subscribe(() => this.updateCount());
    this.render();
  }

  private render(): void {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 0; }
        .header { margin-bottom: 1.25rem; }
        .header h2 { margin: 0 0 0.5rem; font-size: 1.5rem; color: var(--text-primary, #f5efe6); }
        .filters { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .filters button { padding: 0.4rem 0.75rem; font-size: 0.875rem; cursor: pointer;
          background: var(--bg-tertiary, #241f1a); border: 1px solid var(--border, #2d2822);
          border-radius: 6px; color: var(--text-secondary, #b8a99a); }
        .filters button:hover { color: var(--text-primary); border-color: var(--accent, #e07c4c); }
        .filters button.active { background: rgba(224, 124, 76, 0.15); color: var(--accent); border-color: var(--accent); }
        .footer { margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
        .footer span { font-size: 0.85rem; color: var(--text-muted, #7a6f64); }
        .btn-clear { padding: 0.35rem 0.6rem; font-size: 0.8rem; cursor: pointer;
          background: transparent; border: 1px solid var(--border); border-radius: 6px; color: var(--text-muted); }
        .btn-clear:hover { color: var(--error, #c75c5c); border-color: var(--error); }
      </style>
      <div class="header">
        <h2>Todos</h2>
      </div>
      <todo-input></todo-input>
      <div class="filters">
        <button type="button" data-filter="all" class="${this.filter === 'all' ? 'active' : ''}">All</button>
        <button type="button" data-filter="active" class="${this.filter === 'active' ? 'active' : ''}">Active</button>
        <button type="button" data-filter="completed" class="${this.filter === 'completed' ? 'active' : ''}">Completed</button>
      </div>
      <todo-list data-filter="${this.filter}"></todo-list>
      <div class="footer">
        <span class="count"></span>
        <button type="button" class="btn-clear">Clear completed</button>
      </div>
    `;
    this.updateCount();
    this.attachListeners();
  }

  private attachListeners(): void {
    this.shadowRoot?.querySelectorAll('.filters button').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.filter = (btn.getAttribute('data-filter') as FilterType) ?? 'all';
        this.render();
      });
    });
    this.shadowRoot?.querySelector('.btn-clear')?.addEventListener('click', () => {
      todosStore.clearCompleted();
    });
  }

  private updateCount(): void {
    const countEl = this.shadowRoot?.querySelector('.count');
    if (!countEl) return;
    const total = todosStore.getAll().length;
    const completed = todosStore.getFiltered('completed').length;
    const active = total - completed;
    countEl.textContent = `${active} item${active !== 1 ? 's' : ''} left`;
  }
}

export function registerTodoApp(): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, TodoAppElement);
  }
}
