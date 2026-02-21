import { marked } from 'marked';
import type { Doc } from '../types';

const content = `
# Lifecycle Callbacks

Custom elements have built-in lifecycle hooks. Override them to react to DOM events.

| Callback | When it runs |
|----------|--------------|
| \`constructor()\` | Element is created |
| \`connectedCallback()\` | Element is added to the DOM |
| \`disconnectedCallback()\` | Element is removed from the DOM |
| \`adoptedCallback()\` | Element is moved to another document |
| \`attributeChangedCallback()\` | An observed attribute changes |

## observedAttributes

\`attributeChangedCallback\` only fires for attributes you list:

\`\`\`javascript
static get observedAttributes() {
  return ['disabled', 'value'];
}
\`\`\`

Use the buttons below to change attributes and see the components react.
`;

function renderTryIt(): string {
  return `
    <div class="try-it-section">
      <div class="try-it-header">Try it</div>
      <div class="try-it-examples">
        <div class="try-it-example">
          <span class="try-it-label">1. Status badges (attributeChangedCallback)</span>
          <div class="example-block-content live" id="lifecycle-status-demo">
            <wc-status status="ok"></wc-status>
            <wc-status status="warning"></wc-status>
            <wc-status status="error"></wc-status>
            <wc-status status="info"></wc-status>
            <div class="try-it-controls">
              <span>Change first badge:</span>
              <button class="btn btn-secondary btn-sm" data-status="ok">ok</button>
              <button class="btn btn-secondary btn-sm" data-status="warning">warning</button>
              <button class="btn btn-secondary btn-sm" data-status="error">error</button>
            </div>
          </div>
        </div>
        <div class="try-it-example">
          <span class="try-it-label">2. Toggle switch (real-world: settings, notifications)</span>
          <div class="example-block-content live">
            <wc-toggle-switch></wc-toggle-switch>
            <wc-toggle-switch checked="true"></wc-toggle-switch>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const lifecycle: Doc = {
  id: 'lifecycle',
  title: 'Lifecycle',
  render() {
    return `<div class="doc-content">${marked(content)}${renderTryIt()}</div>`;
  },
  afterRender() {
    if (!window.customElements.get('wc-status')) {
      class Status extends HTMLElement {
        static get observedAttributes(): string[] {
          return ['status'];
        }
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
          this.render();
        }
        attributeChangedCallback(_name: string) {
          if (_name === 'status') this.render();
        }
        render() {
          if (!this.shadowRoot) return;
          const s = this.getAttribute('status') || 'info';
          const colors: Record<string, string> = {
            ok: '#6b9b6b',
            warning: '#d4a84b',
            error: '#c75c5c',
            info: '#7a6f64',
          };
          const c = colors[s] || colors.info;
          this.shadowRoot.innerHTML = `
            <style>
              .badge { padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; color: #f5efe6; }
            </style>
            <span class="badge" style="background:${c}66">${s}</span>
          `;
        }
      }
      window.customElements.define('wc-status', Status);
    }
    if (!window.customElements.get('wc-toggle-switch')) {
      class ToggleSwitch extends HTMLElement {
        static get observedAttributes(): string[] {
          return ['checked'];
        }
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
          this.render();
        }
        attributeChangedCallback() {
          this.render();
        }
        render() {
          if (!this.shadowRoot) return;
          const checked = this.getAttribute('checked') === 'true';
          this.shadowRoot.innerHTML = `
            <style>
              button { width: 44px; height: 24px; border-radius: 12px; border: none; cursor: pointer;
                padding: 0; position: relative; transition: background 0.2s; }
              span { position: absolute; width: 18px; height: 18px; top: 3px; border-radius: 50%;
                background: white; transition: transform 0.2s; }
            </style>
            <button type="button" style="background:${checked ? '#6b9b6b' : '#2d2822'}">
              <span style="transform:translateX(${checked ? '22px' : '3px'})"></span>
            </button>
          `;
          this.shadowRoot.querySelector('button')!.onclick = () => {
            const c = this.getAttribute('checked') === 'true';
            this.setAttribute('checked', (!c).toString());
          };
        }
      }
      window.customElements.define('wc-toggle-switch', ToggleSwitch);
    }
    const statusDemo = document.getElementById('lifecycle-status-demo');
    if (statusDemo) {
      const firstBadge = statusDemo.querySelector('wc-status');
      statusDemo.querySelectorAll<HTMLButtonElement>('[data-status]').forEach((btn) => {
        btn.onclick = () =>
          firstBadge?.setAttribute('status', btn.dataset.status || '');
      });
    }
  },
};
