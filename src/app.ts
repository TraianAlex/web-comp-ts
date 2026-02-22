import type { Doc } from './types';
import { docs } from './docs';
import { Playground } from './playground/sandbox';
import { TodoApp } from './todos';

export class App {
  private container: HTMLElement;
  private currentView: 'doc' | 'playground' | 'todos' | null = null;
  private currentDocId: string | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  mount(): void {
    this.render();
    this.setupNavigation();
    this.setupInitialRoute();
  }

  private setupInitialRoute(): void {
    const hash = window.location.hash.slice(1);
    if (hash === 'playground') {
      this.showPlayground();
    } else if (hash === 'todos') {
      this.showTodos();
    } else if (hash) {
      this.showDoc(hash);
    } else if (docs.length > 0) {
      this.showDoc(docs[0].id);
    }
  }

  private setupNavigation(): void {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'playground') {
        this.showPlayground();
      } else if (hash === 'todos') {
        this.showTodos();
      } else if (hash) {
        this.showDoc(hash);
      }
    });
  }

  private showDoc(id: string): void {
    const doc = docs.find((d) => d.id === id);
    if (!doc) return;

    this.currentDocId = id;
    this.currentView = 'doc';

    const main = this.container.querySelector('.app-main');
    if (main) {
      main.classList.remove('app-main--playground');
      main.innerHTML = doc.render();
      main.scrollTop = 0;
      doc.afterRender?.();
    }

    this.updateNavState();
  }

  private showPlayground(): void {
    this.currentView = 'playground';
    this.currentDocId = null;

    const main = this.container.querySelector('.app-main');
    if (main) {
      main.classList.remove('app-main--todos');
      main.classList.add('app-main--playground');
      const playground = new Playground();
      main.innerHTML = playground.render();
      playground.mount(main as HTMLElement);
    }

    this.updateNavState();
  }

  private showTodos(): void {
    this.currentView = 'todos';
    this.currentDocId = null;

    const main = this.container.querySelector('.app-main');
    if (main) {
      main.classList.remove('app-main--playground');
      main.classList.add('app-main--todos');
      const todoApp = new TodoApp();
      main.innerHTML = todoApp.render();
      todoApp.mount(main as HTMLElement);
    }

    this.updateNavState();
  }

  private updateNavState(): void {
    this.container.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href')?.slice(1) || '';
      link.classList.toggle(
        'active',
        href === this.currentDocId ||
          (href === 'playground' && this.currentView === 'playground') ||
          (href === 'todos' && this.currentView === 'todos')
      );
    });
  }

  private render(): void {
    const navItems = docs
      .map((d) => `<a class="nav-link" href="#${d.id}">${d.title}</a>`)
      .join('');

    this.container.innerHTML = `
      <div class="app-shell">
        <header class="app-header">
          <h1>Web Components</h1>
        </header>
        <aside class="app-sidebar">
          <nav>
            <div class="nav-section">Documentation</div>
            ${navItems}
            <div class="nav-section" style="margin-top: 1rem;">Playground</div>
            <a class="nav-link" href="#playground">Sandbox</a>
            <a class="nav-link" href="#todos">Todos</a>
          </nav>
        </aside>
        <main class="app-main">
          <div class="placeholder">
            <h2>Welcome</h2>
            <p>Select a topic from the sidebar or open the Playground to start.</p>
          </div>
        </main>
      </div>
    `;
  }
}
