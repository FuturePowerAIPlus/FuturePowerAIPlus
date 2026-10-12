# FuturePowerAIPlus

FuturePowerAIPlus is a lightweight AI assistant built for education, coding, mathematics, and general knowledge. It runs locally in the browser and provides a polished, responsive interface for quick knowledge tasks and secure local-first usage.

## Features

- Local-first AI interface with responsive chat layout
- Fast mathematical solving for arithmetic and equations
- Topic-based educational explanations
- Conversation history persisted in browser storage
- Light/dark mode toggle
- Mobile-friendly behavior
- Markdown rendering with code blocks

## Stack

- React
- TypeScript
- Vite
- math.js
- React Markdown

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

## Tests

```bash
npm run test
```

## Notes

This rebuild is intentionally local-first and does not depend on secret API keys or external model downloads. It serves as a foundation for future offline model integration and online provider routing.
