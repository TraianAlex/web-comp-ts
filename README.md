# Web Components — Docs & Playground (TypeScript)

TypeScript version of the Web Components documentation and playground. Same features as the JavaScript version, with full type safety.

## Quick Start

```bash
npm install
npm run dev
```

Opens at [http://localhost:5174](http://localhost:5174) (port 5174 to avoid conflict with the JS version).

## Project Structure

```
├── index.html
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── main.css
│   ├── types.ts
│   ├── app.ts
│   ├── docs/
│   └── playground/
```

## Commands

| Command   | Description          |
|----------|----------------------|
| `npm run dev`    | Start dev server (port 5174) |
| `npm run build`  | Production build to `dist/`   |
| `npm run preview` | Preview production build    |
