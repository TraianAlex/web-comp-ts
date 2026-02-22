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
        <div class="playground-restore-tabs" data-restore-tabs hidden></div>
        <div class="playground-editors">
          <div class="playground-editor-pane" data-pane="html">
            <div class="playground-editor-pane-header">
              <label>HTML</label>
              <button type="button" class="playground-pane-toggle" data-toggle="html" title="Hide HTML">×</button>
            </div>
            <textarea data-html spellcheck="false" placeholder="Write your HTML..."></textarea>
          </div>
          <div class="playground-editor-pane" data-pane="css">
            <div class="playground-editor-pane-header">
              <label>CSS</label>
              <button type="button" class="playground-pane-toggle" data-toggle="css" title="Hide CSS">×</button>
            </div>
            <textarea data-css spellcheck="false" placeholder="Write your CSS..."></textarea>
          </div>
          <div class="playground-editor-pane" data-pane="js">
            <div class="playground-editor-pane-header">
              <label>JavaScript</label>
              <button type="button" class="playground-pane-toggle" data-toggle="js" title="Hide JavaScript">×</button>
            </div>
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
    const restoreTabsEl = container.querySelector<HTMLElement>('[data-restore-tabs]');

    if (!htmlEl || !cssEl || !jsEl || !iframe || !runBtn || !resetBtn) return;

    htmlEl.value = this.html;
    cssEl.value = this.css;
    jsEl.value = this.js;

    const paneLabels: Record<string, string> = { html: 'HTML', css: 'CSS', js: 'JavaScript' };
    const visible: Record<string, boolean> = { html: true, css: true, js: true };

    const updatePaneVisibility = (): void => {
      (['html', 'css', 'js'] as const).forEach((key) => {
        const pane = container.querySelector<HTMLElement>(`[data-pane="${key}"]`);
        if (pane) pane.classList.toggle('playground-editor-pane--hidden', !visible[key]);
      });
      if (restoreTabsEl) {
        const hidden = (['html', 'css', 'js'] as const).filter((k) => !visible[k]);
        if (hidden.length === 0) {
          restoreTabsEl.hidden = true;
          restoreTabsEl.innerHTML = '';
        } else {
          restoreTabsEl.hidden = false;
          restoreTabsEl.innerHTML = hidden
            .map(
              (k) =>
                `<button type="button" class="playground-restore-tab" data-show="${k}">${paneLabels[k]}</button>`
            )
            .join('');
          hidden.forEach((k) => {
            const btn = restoreTabsEl.querySelector<HTMLButtonElement>(`[data-show="${k}"]`);
            btn?.addEventListener('click', () => {
              visible[k] = true;
              updatePaneVisibility();
            });
          });
        }
      }
    };

    container.querySelectorAll<HTMLButtonElement>('[data-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-toggle') as 'html' | 'css' | 'js';
        const visibleCount = (Object.keys(visible) as ('html' | 'css' | 'js')[]).filter(
          (k) => visible[k]
        ).length;
        if (visibleCount > 1 && key) {
          visible[key] = false;
          updatePaneVisibility();
        }
      });
    });

    let runId = 0;

    const run = (): void => {
      runId += 1;
      const currentRunId = runId;
      const html = htmlEl.value;
      const css = cssEl.value;
      const js = jsEl.value;

      const doWrite = (doc: Document): void => {
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
          </body>
          </html>
        `);
        doc.close();

        const script = doc.createElement('script');
        script.textContent = js;
        doc.body.appendChild(script);
      };

      // Load a fresh document so CustomElementRegistry is reset (doc.open() reuses the same document)
      iframe.onload = () => {
        if (currentRunId !== runId) return;
        const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
        if (doc) doWrite(doc);
        iframe.onload = null;
      };
      iframe.src = 'about:blank';
    };

    runBtn.addEventListener('click', () => run());
    resetBtn.addEventListener('click', () => {
      htmlEl.value = DEFAULT_HTML;
      cssEl.value = DEFAULT_CSS;
      jsEl.value = DEFAULT_JS;
      run();
    });

    const debounce = <T extends (...args: any[]) => void>(
      func: T,
      delay: number
    ): ((...args: Parameters<T>) => void) => {
      let timeout: number | undefined;
      return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => func(...args), delay);
      };
    };

    const debouncedRun = debounce(run, 500);

    htmlEl.addEventListener('input', debouncedRun);
    cssEl.addEventListener('input', debouncedRun);
    jsEl.addEventListener('input', debouncedRun);
    run();
  }
}
