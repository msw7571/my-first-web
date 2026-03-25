# Copilot Instructions

## Tech Stack
- Next.js: 16.2.1 (App Router ONLY)
- Tailwind CSS: 4.x

## Coding Conventions
- **Server Components by Default**: Use Server Components whenever possible. Only use Client Components (`'use client'`) when interactivity or browser APIs are required.
- **Tailwind CSS ONLY**: For all styling, use Tailwind CSS utility classes. Avoid custom CSS unless absolutely necessary.

## Known AI Mistakes (DO NOT DO)
- **Do NOT use `next/router`**: Use `next/navigation` for routing in the App Router.
- **Do NOT use Pages Router**: This project uses the App Router exclusively. Ensure all file-based routing follows the `app/` directory convention.
- **`params` must be `await`ed**: In Next.js 15+, `params`, `searchParams`, and other dynamic properties in `page.js` and `layout.js` should be treated as promises and awaited.
