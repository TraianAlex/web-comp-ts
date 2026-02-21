import { marked } from 'marked';
import type { Doc } from '../types';

const content = `
# HTML Templates & Slots

\`<template>\` holds inert HTML that isn't rendered until you use it. \`<slot>\` lets you inject light DOM (user-provided content) into your component's shadow DOM.

## Template Element

\`\`\`html
<template id="my-tpl">
  <p>This won't render until cloned.</p>
</template>
\`\`\`

Content inside \`<template>\` is inert: no images load, no scripts run. You clone and append it when needed.

## Slots

Slots allow composition — the user can pass content that gets slotted into your component:

\`\`\`html
<my-card>
  <h2 slot="title">My Title</h2>
  <p>Body content here.</p>
</my-card>
\`\`\`

Inside your component's shadow DOM:

\`\`\`html
<div class="card">
  <slot name="title">Default title</slot>
  <slot></slot>  <!-- unnamed = default slot for all content without a slot -->
</div>
\`\`\`
`;

function renderTryIt(): string {
  return `
    <div class="try-it-section">
      <div class="try-it-header">Try it</div>
      <div class="try-it-examples">
        <div class="try-it-example">
          <span class="try-it-label">1. Basic card (title + body slots)</span>
          <div class="example-block-content live">
            <wc-card>
              <h2 slot="title">Custom Title</h2>
              <p>This paragraph goes into the default slot.</p>
            </wc-card>
            <wc-card>
              <p>No title slot — uses default "Untitled".</p>
            </wc-card>
          </div>
        </div>
        <div class="try-it-example">
          <span class="try-it-label">2. Product card (real-world: e-commerce grid)</span>
          <div class="example-block-content live">
            <wc-product-card>
              <span slot="image">🛒</span>
              <span slot="name">Wireless Headphones</span>
              <span slot="price">$79.99</span>
            </wc-product-card>
            <wc-product-card>
              <span slot="name">USB-C Cable</span>
              <span slot="price">$12.00</span>
            </wc-product-card>
          </div>
        </div>
        <div class="try-it-example">
          <span class="try-it-label">3. Message banner (real-world: alerts, tips)</span>
          <div class="example-block-content live">
            <wc-message-banner>
              <span slot="icon">💡</span>
              <p>Use the Playground to experiment with these components!</p>
            </wc-message-banner>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const templates: Doc = {
  id: 'templates',
  title: 'Templates & Slots',
  render() {
    return `<div class="doc-content">${marked(content)}${renderTryIt()}</div>`;
  },
  afterRender() {
    if (!window.customElements.get('wc-card')) {
      class Card extends HTMLElement {
        connectedCallback() {
          this.attachShadow({ mode: 'open' });
          if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
              <style>
                .card {
                  border: 1px solid #2d2822;
                  border-radius: 10px;
                  padding: 1rem;
                  background: #1a1612;
                }
                ::slotted(h2) { margin: 0 0 0.5rem; font-size: 1.1rem; color: #f5efe6; }
                ::slotted(p) { margin: 0; color: #b8a99a; font-size: 0.9rem; }
              </style>
              <div class="card">
                <slot name="title">Untitled</slot>
                <slot></slot>
              </div>
            `;
          }
        }
      }
      window.customElements.define('wc-card', Card);
    }
    if (!window.customElements.get('wc-product-card')) {
      class ProductCard extends HTMLElement {
        connectedCallback() {
          this.attachShadow({ mode: 'open' });
          if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
              <style>
                .product { border: 1px solid #2d2822; border-radius: 10px; overflow: hidden; max-width: 280px; }
                .product-image { height: 160px; background: #241f1a; display: flex; align-items: center; justify-content: center; color: #7a6f64; }
                .product-body { padding: 1rem; }
                ::slotted([slot="name"]) { margin: 0 0 0.25rem; font-weight: 600; font-size: 1rem; }
                ::slotted([slot="price"]) { color: #6b9b6b; font-weight: 600; }
              </style>
              <div class="product">
                <div class="product-image"><slot name="image">📦 Image</slot></div>
                <div class="product-body">
                  <slot name="name">Product name</slot>
                  <slot name="price">$0.00</slot>
                  <slot></slot>
                </div>
              </div>
            `;
          }
        }
      }
      window.customElements.define('wc-product-card', ProductCard);
    }
    if (!window.customElements.get('wc-message-banner')) {
      class MessageBanner extends HTMLElement {
        connectedCallback() {
          this.attachShadow({ mode: 'open' });
          if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
              <style>
                .banner { padding: 1rem 1.25rem; border-radius: 8px; display: flex; align-items: flex-start; gap: 0.75rem;
                  background: rgba(224, 124, 76, 0.15); border: 1px solid rgba(224, 124, 76, 0.3); }
                .banner-icon { font-size: 1.25rem; flex-shrink: 0; }
                .banner-content { flex: 1; }
                ::slotted(*) { margin: 0; color: #b8a99a; font-size: 0.9rem; }
              </style>
              <div class="banner">
                <span class="banner-icon"><slot name="icon">ℹ️</slot></span>
                <div class="banner-content"><slot></slot></div>
              </div>
            `;
          }
        }
      }
      window.customElements.define('wc-message-banner', MessageBanner);
    }
  },
};
