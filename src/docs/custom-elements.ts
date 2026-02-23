import { marked } from 'marked';
import type { Doc } from '../types';

const content = `
# Custom Elements

Custom Elements let you define your own HTML tags. The name **must** contain a hyphen (\`-\`) to avoid conflicts with current or future built-in elements.

## Naming Rules

- Must contain at least one hyphen: \`my-button\`, \`wc-tabs\` ✓
- Single words without hyphen: \`mybutton\` ✗
- Use a prefix (e.g. \`wc-\`, \`app-\`) to avoid clashes

## Defining a Custom Element

\`\`\`javascript
class MyButton extends HTMLElement {
  constructor() {
    super();
    // Always call super() first!
  }

  connectedCallback() {
    // Runs when element is added to the DOM
    this.textContent = 'Click me';
  }
}

customElements.define('my-button', MyButton);
\`\`\`

## Using the Element

\`\`\`html
<my-button></my-button>
\`\`\`

That's it! The element behaves like any native tag. You can also use \`document.createElement('my-button')\` or innerHTML.
`;

function renderTryIt(): string {
  return `
    <div class="try-it-section">
      <div class="try-it-header">Try it</div>
      <div class="try-it-examples">
        <div class="try-it-example">
          <span class="try-it-label">1. Greeting (attributes: name)</span>
          <div class="example-block-content live">
            <wc-greeting name="Web Components"></wc-greeting>
            <wc-greeting name="Developer"></wc-greeting>
          </div>
        </div>
        <div class="try-it-example">
          <span class="try-it-label">2. Price tag (real-world: e-commerce)</span>
          <div class="example-block-content live">
            <wc-price-tag amount="29.99" currency="$"></wc-price-tag>
            <wc-price-tag amount="149" currency="€"></wc-price-tag>
          </div>
        </div>
        <div class="try-it-example">
          <span class="try-it-label">3. User chip (real-world: comments, mentions)</span>
          <div class="example-block-content live">
            <wc-user-chip name="Alice"></wc-user-chip>
            <wc-user-chip name="Bob"></wc-user-chip>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const customElementsDoc: Doc = {
  id: 'custom-elements',
  title: 'Custom Elements',
  render() {
    return `<div class="doc-content">${marked(content)}${renderTryIt()}</div>`;
  },
  afterRender() {
    if (!window.customElements.get('wc-greeting')) {
      class Greeting extends HTMLElement {
        static get observedAttributes(): string[] {
          return ['name'];
        }
        connectedCallback() {
          const name = this.getAttribute('name') || 'World';
          this.innerHTML = `<strong>Hello, ${name}!</strong>`;
        }
        attributeChangedCallback(name: string, _oldVal: string | null, newVal: string | null) {
          if (name === 'name')
            this.innerHTML = `<strong>Hello, ${newVal ?? 'World'}!</strong>`;
        }
      }
      window.customElements.define('wc-greeting', Greeting);
    }
    if (!window.customElements.get('wc-price-tag')) {
      class PriceTag extends HTMLElement {
        static get observedAttributes(): string[] {
          return ['amount', 'currency'];
        }
        connectedCallback() {
          this.render();
        }
        attributeChangedCallback() {
          this.render();
        }
        render() {
          const amount = this.getAttribute('amount') || '0';
          const currency = this.getAttribute('currency') || '$';
          this.innerHTML = `<span style="font-weight:600;color:#6b9b6b">${currency}${amount}</span>`;
        }
      }
      window.customElements.define('wc-price-tag', PriceTag);
    }
    if (!window.customElements.get('wc-user-chip')) {
      class UserChip extends HTMLElement {
        static get observedAttributes(): string[] {
          return ['name'];
        }
        connectedCallback() {
          this.render();
        }
        attributeChangedCallback(name: string) {
          if (name === 'name') this.render();
        }
        private render() {
          const name = this.getAttribute('name') || 'User';
          const initial = name.charAt(0).toUpperCase();
          this.innerHTML = `
            <span style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.35rem 0.75rem;
              background:#241f1a;border-radius:20px;font-size:0.9rem;">
              <span style="width:24px;height:24px;border-radius:50%;background:#e07c4c;color:white;
                display:flex;align-items:center;justify-content:center;font-weight:600;">${initial}</span>
              <span>${name}</span>
            </span>
          `;
        }
      }
      window.customElements.define('wc-user-chip', UserChip);
    }
  },
};
