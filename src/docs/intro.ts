import { marked } from 'marked';
import type { Doc } from '../types';

const content = `
# Introduction to Web Components

Web Components are a set of **browser APIs** that let you create reusable, encapsulated custom HTML elements. They work with vanilla JavaScript (no framework required) and are supported in all modern browsers.

## What Are Web Components?

Web Components consist of four main standards:

1. **Custom Elements** — Define new HTML tags (e.g. \`<my-button>\`)
2. **Shadow DOM** — Encapsulated CSS and markup (styles don't leak in/out)
3. **HTML Templates** — \`<template>\` and \`<slot>\` for reusable markup
4. **ES Modules** — Load components as modules

## Why Use Them?

- **Framework-agnostic** — Work in React, Vue, Angular, or plain HTML
- **Native** — No build step required (though tools like Vite help with bundling)
- **Encapsulated** — Styles and DOM are scoped by default
- **Reusable** — Define once, use anywhere

## Basic Example

Below is a minimal custom element. It increments a counter when clicked.
`;

function renderTryIt(): string {
  return `
    <div class="try-it-section">
      <div class="try-it-header">Try it</div>
      <div class="try-it-examples">
        <div class="try-it-example">
          <span class="try-it-label">1. Simple counter</span>
          <div class="example-block-content live">
            <wc-demo-counter></wc-demo-counter>
          </div>
        </div>
        <div class="try-it-example">
          <span class="try-it-label">2. Like button (real-world: social feed)</span>
          <div class="example-block-content live">
            <wc-like-button count="42"></wc-like-button>
            <wc-like-button count="0"></wc-like-button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const intro: Doc = {
  id: 'intro',
  title: 'Introduction',
  render() {
    return `<div class="doc-content">${marked(content)}${renderTryIt()}</div>`;
  },
  afterRender() {
    if (!window.customElements.get('wc-demo-counter')) {
      class DemoCounter extends HTMLElement {
        count = 0;
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
          this.render();
        }
        render() {
          if (!this.shadowRoot) return;
          this.shadowRoot.innerHTML = `
            <style>
              button { padding: 0.5rem 1rem; font-size: 1rem; cursor: pointer;
                background: #e07c4c; color: white; border: none; border-radius: 6px; }
              button:hover { opacity: 0.9; }
              span { margin-left: 0.5rem; font-weight: bold; color: #f5efe6; }
            </style>
            <button type="button">Click me</button>
            <span>${this.count}</span>
          `;
          const btn = this.shadowRoot.querySelector('button');
          const span = this.shadowRoot.querySelector('span');
          if (btn && span) {
            btn.onclick = () => {
              this.count++;
              span.textContent = String(this.count);
            };
          }
        }
      }
      window.customElements.define('wc-demo-counter', DemoCounter);
    }
    if (!window.customElements.get('wc-like-button')) {
      class LikeButton extends HTMLElement {
        liked = false;
        count = 0;
        constructor() {
          super();
          this.count = parseInt(this.getAttribute('count') || '0', 10);
          this.attachShadow({ mode: 'open' });
        }
        connectedCallback() {
          this.render();
        }
        render() {
          if (!this.shadowRoot) return;
          const heart = this.liked ? '♥' : '♡';
          const color = this.liked ? '#c75c5c' : '#7a6f64';
          this.shadowRoot.innerHTML = `
            <style>
              button { padding: 0.4rem 0.8rem; cursor: pointer; background: transparent;
                border: 1px solid #2d2822; border-radius: 6px; font-size: 1rem;
                display: inline-flex; align-items: center; gap: 0.4rem; color: #b8a99a; }
              button:hover { border-color: #e07c4c; }
            </style>
            <button type="button">
              <span style="color:${color}">${heart}</span>
              <span>${this.count}</span>
            </button>
          `;
          this.shadowRoot.querySelector('button').onclick = () => {
            this.liked = !this.liked;
            this.count += this.liked ? 1 : -1;
            this.render();
          };
        }
      }
      window.customElements.define('wc-like-button', LikeButton);
    }
  },
};
