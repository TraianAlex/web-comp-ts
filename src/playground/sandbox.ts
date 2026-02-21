const DEFAULT_HTML = `<!-- Your HTML here - use <wc-counter></wc-counter> etc. -->
<div style="padding: 1rem;">
  <wc-counter></wc-counter>
</div>`;

const DEFAULT_CSS = `/* Styles for your preview */
wc-counter {
  display: inline-block;
}`;

const DEFAULT_JS = `// Define your web component
class Counter extends HTMLElement {
  static get observedAttributes() { return ['count']; }

  constructor() {
    super();
    this._count = parseInt(this.getAttribute('count') || '0', 10);
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = \`
      <style>
        button { padding: 0.5rem 1rem; font-size: 1rem; cursor: pointer; }
        span { margin-left: 0.5rem; font-weight: bold; color: #f5efe6; }
      </style>
      <button type="button">Count</button>
      <span>\${this._count}</span>
    \`;
    this.shadowRoot.querySelector('button').addEventListener('click', () => {
      this._count++;
      this.render();
    });
  }
}

customElements.define('wc-counter', Counter);`;

export class Playground {
  html: string;
  css: string;
  js: string;

  constructor() {
    this.html = DEFAULT_HTML;
    this.css = DEFAULT_CSS;
    this.js = DEFAULT_JS;
  }

  render(): string {
    return `
      <div class="playground-container">
        <div class="playground-toolbar">
          <button class="btn btn-primary" data-run>Run</button>
          <button class="btn btn-secondary" data-reset>Reset</button>
        </div>
        <div class="playground-editors">
          <div class="playground-editor-pane">
            <label>HTML</label>
            <textarea data-html spellcheck="false" placeholder="Write your HTML..."></textarea>
          </div>
          <div class="playground-editor-pane">
            <label>CSS</label>
            <textarea data-css spellcheck="false" placeholder="Write your CSS..."></textarea>
          </div>
          <div class="playground-editor-pane">
            <label>JavaScript</label>
            <textarea data-js spellcheck="false" placeholder="Define customElements.define(...)"></textarea>
          </div>
        </div>
        <div class="playground-preview">
          <iframe data-preview title="Preview"></iframe>
        </div>
      </div>
    `;
  }

  mount(container: HTMLElement): void {
    const htmlEl = container.querySelector<HTMLTextAreaElement>('[data-html]');
    const cssEl = container.querySelector<HTMLTextAreaElement>('[data-css]');
    const jsEl = container.querySelector<HTMLTextAreaElement>('[data-js]');
    const iframe = container.querySelector<HTMLIFrameElement>('[data-preview]');
    const runBtn = container.querySelector<HTMLButtonElement>('[data-run]');
    const resetBtn = container.querySelector<HTMLButtonElement>('[data-reset]');

    if (!htmlEl || !cssEl || !jsEl || !iframe || !runBtn || !resetBtn) return;

    htmlEl.value = this.html;
    cssEl.value = this.css;
    jsEl.value = this.js;

    const run = (): void => {
      const html = htmlEl.value;
      const css = cssEl.value;
      const js = jsEl.value;

      const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (!doc) return;

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { background: #1a1612; color: #f5efe6; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>${js}<\/script>
        </body>
        </html>
      `);
      doc.close();
    };

    runBtn.addEventListener('click', run);
    resetBtn.addEventListener('click', () => {
      htmlEl.value = DEFAULT_HTML;
      cssEl.value = DEFAULT_CSS;
      jsEl.value = DEFAULT_JS;
      run();
    });

    run();
  }
}
