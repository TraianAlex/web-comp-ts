import { todosStore } from './todos-store';

const tagName = 'todo-input';

export class TodoInputElement extends HTMLElement {
  private input: HTMLInputElement | null = null;

  connectedCallback(): void {
    this.attachShadow({ mode: 'open' });
    this.render();
    this.attachListeners();
  }

  private render(): void {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
        input { flex: 1; padding: 0.6rem 0.75rem; font-size: 1rem; font-family: inherit;
          background: var(--bg-code, #1e1b16); color: var(--text-primary, #f5efe6);
          border: 1px solid var(--border, #2d2822); border-radius: 6px; }
        input::placeholder { color: var(--text-muted, #7a6f64); }
        input:focus { outline: none; border-color: var(--accent, #e07c4c); }
        button { padding: 0.6rem 1.25rem; font-size: 1rem; font-weight: 500; cursor: pointer;
          background: var(--accent, #e07c4c); color: #0f0d0b; border: none; border-radius: 6px; }
        button:hover { background: var(--accent-hover, #eb9068); }
      </style>
      <form>
        <input type="text" placeholder="What needs to be done?" autocomplete="off" />
        <button type="submit">Add</button>
      </form>
    `;
    this.input = this.shadowRoot.querySelector('input');
  }

  private attachListeners(): void {
    const form = this.shadowRoot?.querySelector('form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = this.input?.value?.trim();
      if (title) {
        todosStore.add(title);
        this.input!.value = '';
      }
    });
  }
}

export function registerTodoInput(): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, TodoInputElement);
  }
}
