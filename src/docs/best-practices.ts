import { marked } from 'marked';
import type { Doc } from '../types';

const content = `
# Best Practices

## 1. Use Hyphens in Names

Always use at least one hyphen: \`my-component\`, \`app-header\`. This avoids collisions with future HTML elements.

## 2. Extend the Right Class

- \`HTMLElement\` — default for most components
- \`HTMLButtonElement\` — if your component extends \`<button>\`
- \`HTMLInputElement\` — if it extends \`<input>\`

## 3. Call \`super()\` First

In \`constructor()\`, always call \`super()\` before any \`this\` access.

## 4. Avoid Heavy Work in \`constructor()\`

Prefer \`connectedCallback()\` for DOM setup. The constructor runs before the element is in the document.

## 5. Use Shadow DOM for Encapsulation

Unless you need global styles, use \`attachShadow({ mode: 'open' })\` to isolate your component's styles and DOM.

## 6. Use \`observedAttributes\` for Reactivity

Only attributes in \`observedAttributes\` trigger \`attributeChangedCallback\`. List all attributes you want to react to.

## 7. Clean Up in \`disconnectedCallback()\`

Remove event listeners, cancel timers, and abort fetch requests when the element is removed to avoid memory leaks.
`;

function renderTryIt(): string {
  return `
    <div class="try-it-section">
      <div class="try-it-header">Try it</div>
      <div class="try-it-examples">
        <div class="try-it-example">
          <span class="try-it-label">Example: Component using best practices</span>
          <p class="try-it-desc">Uses hyphenated name, Shadow DOM, observedAttributes, and disconnectedCallback for cleanup.</p>
          <div class="example-block-content live">
            <wc-best-practice-demo label="Clicks"></wc-best-practice-demo>
            <wc-best-practice-demo label="Likes"></wc-best-practice-demo>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const bestPractices: Doc = {
  id: 'best-practices',
  title: 'Best Practices',
  render() {
    return `<div class="doc-content">${marked(content)}${renderTryIt()}</div>`;
  },
  afterRender() {
    if (!window.customElements.get('wc-best-practice-demo')) {
      class BestPracticeDemo extends HTMLElement {
        count?: number;
        private _boundClick = () => this.handleClick();

        static get observedAttributes(): string[] {
          return ['label'];
        }

        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
          this.render();
        }

        disconnectedCallback() {
          const btn = this.shadowRoot?.querySelector('button');
          if (btn) btn.removeEventListener('click', this._boundClick);
        }

        attributeChangedCallback() {
          this.render();
        }

        handleClick() {
          this.count = (this.count || 0) + 1;
          const el = this.shadowRoot?.querySelector('.count');
          if (el) el.textContent = String(this.count);
        }

        render() {
          if (!this.shadowRoot) return;
          const label = this.getAttribute('label') || 'Item';
          const count = this.count ?? 0;
          this.shadowRoot.innerHTML = `
            <style>
              .item { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;
                background: #241f1a; border-radius: 8px; border: 1px solid #2d2822; }
              button { padding: 0.35rem 0.6rem; font-size: 0.85rem; cursor: pointer;
                background: #e07c4c; color: white; border: none; border-radius: 4px; }
              .count { color: #6b9b6b; font-weight: 600; }
            </style>
            <div class="item">
              <span>${label}</span>
              <button type="button">+1</button>
              <span class="count">${count}</span>
            </div>
          `;
          this.shadowRoot
            .querySelector('button')
            ?.addEventListener('click', this._boundClick);
        }
      }
      window.customElements.define('wc-best-practice-demo', BestPracticeDemo);
    }
  },
};
