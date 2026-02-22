import './todo-app';

export class TodoApp {
  render(): string {
    return `<div class="todos-page"><todo-app></todo-app></div>`;
  }

  mount(container: HTMLElement): void {
    // Components are registered via index; nothing else to do
  }
}
