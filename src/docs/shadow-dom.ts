import { marked } from 'marked';
import type { Doc } from '../types';

const content = `
# Shadow DOM

Shadow DOM provides **encapsulation**: CSS and DOM inside a shadow root are isolated from the rest of the page. External styles don't affect it, and its styles don't leak out.

## Creating a Shadow Root

\`\`\`javascript
this.attachShadow({ mode: 'open' });
\`\`\`

- \`open\`: The shadow root is accessible via \`element.shadowRoot\`
- \`closed\`: \`shadowRoot\` is \`null\` (rarely used)

## Why It Matters

Without Shadow DOM, your component's styles could be overridden by page CSS, or your component could accidentally style the rest of the page. Shadow DOM solves both.

The components below use Shadow DOM — page styles cannot override their internal appearance.
`;

function renderTryIt(): string {
  return `
    <div class="try-it-section">
      <div class="try-it-header">Try it</div>
      <div class="try-it-examples">
        <div class="try-it-example">
          <span class="try-it-label">1. Colored box (encapsulated styles)</span>
          <div class="example-block-content live">
            <wc-colored-box></wc-colored-box>
          </div>
        </div>
        <div class="try-it-example">
          <span class="try-it-label">2. Alert / notification (real-world: form feedback)</span>
          <div class="example-block-content live">
            <wc-alert-box type="success">Saved successfully!</wc-alert-box>
            <wc-alert-box type="warning">Check your input</wc-alert-box>
            <wc-alert-box type="error">Something went wrong</wc-alert-box>
          </div>
        </div>
        <div class="try-it-example">
          <span class="try-it-label">3. Progress bar (real-world: file upload, loading)</span>
          <div class="example-block-content live" style="flex-direction: column; width: 100%;">
            <wc-progress-bar value="65" max="100"></wc-progress-bar>
            <wc-progress-bar value="3" max="10"></wc-progress-bar>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const shadowDom: Doc = {
  id: 'shadow-dom',
  title: 'Shadow DOM',
  render() {
    return `<div class="doc-content">${marked(content)}${renderTryIt()}</div>`;
  },
  afterRender() {
    if (!window.customElements.get('wc-colored-box')) {
      class ColoredBox extends HTMLElement {
        connectedCallback() {
          this.attachShadow({ mode: 'open' });
          if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
              <style>
                .box {
                  padding: 1rem 1.5rem;
                  border-radius: 8px;
                  font-weight: 600;
                  background: linear-gradient(135deg, #e07c4c, #b85d34);
                  color: white;
                }
              </style>
              <div class="box">Encapsulated — page CSS cannot override this</div>
            `;
          }
        }
      }
      window.customElements.define('wc-colored-box', ColoredBox);
    }
    if (!window.customElements.get('wc-alert-box')) {
      class AlertBox extends HTMLElement {
        static get observedAttributes(): string[] {
          return ['type'];
        }
        connectedCallback() {
          this.attachShadow({ mode: 'open' });
          this.render();
        }
        attributeChangedCallback() {
          this.render();
        }
        render() {
          if (!this.shadowRoot) return;
          const type = this.getAttribute('type') || 'info';
          const styles: Record<string, { bg: string; text: string }> = {
            success: { bg: '#6b9b6b', text: 'white' },
            warning: { bg: '#d4a84b', text: '#1a1612' },
            error: { bg: '#c75c5c', text: 'white' },
            info: { bg: '#7a6f64', text: 'white' },
          };
          const s = styles[type] || styles.info;
          this.shadowRoot.innerHTML = `
            <style>
              .alert { padding: 0.75rem 1rem; border-radius: 8px; font-size: 0.9rem; }
            </style>
            <div class="alert" style="background:${s.bg};color:${s.text}">
              ${this.textContent || 'Message here'}
            </div>
          `;
        }
      }
      window.customElements.define('wc-alert-box', AlertBox);
    }
    if (!window.customElements.get('wc-progress-bar')) {
      class ProgressBar extends HTMLElement {
        static get observedAttributes(): string[] {
          return ['value', 'max'];
        }
        connectedCallback() {
          this.attachShadow({ mode: 'open' });
          this.render();
        }
        attributeChangedCallback() {
          this.render();
        }
        render() {
          if (!this.shadowRoot) return;
          const value = parseInt(this.getAttribute('value') || '0', 10);
          const max = parseInt(this.getAttribute('max') || '100', 10);
          const pct =
            max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
          this.shadowRoot.innerHTML = `
            <style>
              :host { display: block; width: 100%; min-width: 120px; }
              .track { height: 12px; background: #2d2822; border-radius: 6px; overflow: hidden; }
              .fill { height: 100%; background: #e07c4c; border-radius: 6px; transition: width 0.2s; }
            </style>
            <div class="track">
              <div class="fill" style="width:${pct}%"></div>
            </div>
          `;
        }
      }
      window.customElements.define('wc-progress-bar', ProgressBar);
    }
  },
};
