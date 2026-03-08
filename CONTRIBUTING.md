# Contributing to CyberTorn Terminal

Thank you for your interest in contributing! This project follows a specific set of rules to keep the codebase clean and automated.

## How to Contribute

1.  **Fork** the repository.
2.  **Clone** your fork to your local machine.
3.  **Create a branch** for your feature or bug fix.
4.  **Make your changes** and ensure they pass linting (`bun run lint`).
5.  **Commit your changes** using [Conventional Commits](#conventional-commits).
6.  **Push** your branch and **open a Pull Request**.

## Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) to automate our versioning and changelog generation. Please format your commit messages as follows:

-   `feat: <description>`: For new features (triggers a **Minor** version bump).
-   `fix: <description>`: For bug fixes (triggers a **Patch** version bump).
-   `chore: <description>`: For maintenance tasks like updating dependencies (no version bump).
-   `docs: <description>`: For documentation changes (no version bump).
-   `refactor: <description>`: For code changes that neither fix a bug nor add a feature.
-   `style: <description>`: For changes that do not affect the meaning of the code (white-space, formatting, etc).

**Breaking Changes:**
If your change breaks backward compatibility, add an `!` after the type or `BREAKING CHANGE:` in the footer:
-   `feat!: change authentication logic` (triggers a **Major** version bump).

## Development Commands

-   `bun install`: Install dependencies.
-   `bun run dev`: Start development server.
-   `bun run lint`: Run ESLint to check code style.
-   `bun run build`: Verify the production build.
-   `bun test`: Run unit tests.

## Release Process

Only maintainers should run the release command:
```bash
bun run release
```
This command automatically updates the version, generates the `CHANGELOG.md`, and creates a Git tag.
