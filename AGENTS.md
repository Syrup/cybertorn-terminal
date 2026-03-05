# Agent Operational Guidelines

This file contains crucial instructions, commands, and conventions for any autonomous coding agent operating in the `CyberTorn Terminal` repository. Adhere strictly to these guidelines.

## 1. Build, Lint, and Test Commands

*   **Development Server:** `npm run dev` (Runs Next.js dev server).
*   **Production Build:** `npm run build` (Creates an optimized production build).
*   **Start Production Server:** `npm run start` (Starts the built application).
*   **Linting:** `npm run lint` (Runs ESLint).
*   **Running All Tests:** `npm test` (Currently runs `node --import=tsx src/lib/equipment-utils.test.ts`).
*   **Running a Single Test:** Since there is no dedicated test runner like Jest or Vitest specified in `package.json`, tests are executed directly using `tsx` (TypeScript Execute). To run a specific test file, use:
    ```bash
    node --import=tsx path/to/your/test.file.test.ts
    ```
*   **End-to-End Tests:** Playwright is installed (`@playwright/test`). To run E2E tests (assuming standard configuration):
    ```bash
    npx playwright test
    ```

## 2. Technology Stack

*   **Framework:** Next.js (Version 16+)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Version 4+)
*   **Icons:** Lucide React
*   **Theme Management:** `next-themes`

## 3. Code Style and Conventions

### 3.1. General Principles

*   **Idiomatic Next.js/React:** Follow standard React (v19) and Next.js (App Router) patterns.
*   **Readability:** Prioritize code readability and maintainability.
*   **Simplicity:** Avoid over-engineering. Write straightforward, clear logic.

### 3.2. File and Directory Structure

*   Use standard Next.js App Router conventions (e.g., `app/page.tsx`, `app/layout.tsx`).
*   Place reusable utility functions in `src/lib/`.
*   Place UI components in `src/components/`.

### 3.3. TypeScript & Typing

*   **Strict Typing:** Always use TypeScript. Avoid `any` whenever possible.
*   **Interfaces/Types:** Define clear `interface` or `type` definitions for component props, API responses, and complex data structures.
*   **Inference:** Rely on type inference where it is clear and unambiguous.

### 3.4. Naming Conventions

*   **Components:** PascalCase (e.g., `Button`, `UserProfile`). File names for components should also be PascalCase or follow Next.js conventions (e.g., `page.tsx`).
*   **Functions & Variables:** camelCase (e.g., `calculateTotal`, `userData`).
*   **Constants:** UPPER_SNAKE_CASE for global constants (e.g., `MAX_RETRY_COUNT`).
*   **Booleans:** Prefix with `is`, `has`, `should` (e.g., `isLoading`, `hasError`).

### 3.5. Component Architecture

*   **Functional Components:** Use functional components with hooks. Do not use class components.
*   **Server vs. Client Components:** Understand and utilize Next.js Server Components by default. Add the `"use client"` directive only when a component requires client-side interactivity (e.g., `useState`, `useEffect`, event listeners).

### 3.6. State Management

*   Prefer local component state (`useState`, `useReducer`) for UI-specific state.
*   Use context API sparingly for truly global state, but consider URL state or other patterns first if applicable.

### 3.7. Styling (Tailwind CSS)

*   Utilize Tailwind CSS utility classes for styling.
*   Keep class strings readable. Extract complex class combinations into reusable variables or use a utility like `clsx` or `tailwind-merge` if conditional logic is needed.

### 3.8. Error Handling

*   Implement robust error handling, especially for external API calls or asynchronous operations.
*   Use `try...catch` blocks for `async/await`.
*   Provide meaningful error messages or fallback UI states rather than letting the application crash silently.

### 3.9. Imports

*   Group imports logically.
*   Prefer absolute imports (e.g., `@/components/...`) if configured, otherwise use clean relative paths.
*   Import only what is needed.

### 3.10. Comments

*   Focus on explaining *why* complex logic is implemented a certain way, rather than *what* obvious code is doing.
*   Use JSDoc style comments for shared utility functions to improve developer experience (intellisense).

## 4. Interaction Rules for Agents

*   **Verification:** After writing or modifying code, *always* run the linter (`npm run lint`) and build (`npm run build`) to ensure no errors were introduced.
*   **Test Execution:** If writing logic that should be tested, run the relevant test file using the command specified in section 1 to verify the changes.
*   **No Unprompted Structural Changes:** Do not significantly alter the project structure or introduce new major dependencies without explicit user confirmation.
*   **Mimic Existing Code:** When modifying existing files, carefully observe and match the surrounding coding style and patterns.
