# CyberTorn Terminal

A functional, high-density interface for the Torn City API. Built with Next.js and Tailwind CSS for players who prioritize data over aesthetics.

## Core Features

- **Character Monitoring**: Real-time tracking of battle stats, energy, nerve, and life.
- **Financial Ledger**: Detailed breakdown of cash, vault holdings, and total networth.
- **Operational Status**: Monitoring for crimes, attacks, and faction activities.
- **Asset Management**: View properties, stock holdings, and equipment.
- **Zero-Server Storage**: API keys are stored in your browser's local storage. Data is fetched directly from the Torn API.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Syrup/cybertorn-terminal.git
   ```

2. **Install dependencies**
   ```bash
   bun install
   # Fallback: npm install
   ```

3. **Start the development server**
   ```bash
   bun run dev
   # Fallback: npm run dev
   ```

4. **Configuration**
   - **Self-hosting**: Just open `http://localhost:3000` and enter your Torn API key. No environment variables required.
   - **Production**: See the [Environment Variables](#configuration--environment-variables) section for optional feature flag configuration.

## Configuration & Environment Variables

If you are self-hosting, you can safely ignore all environment variables. The application is designed to work out of the box with safe defaults.

### Feature Flags (Optional - ConfigCat)

The project integrates with [ConfigCat](https://configcat.com/) for remote feature toggling, global announcements, and maintenance mode. The application is designed to **work perfectly without it** (all features will be enabled and maintenance mode will be off by default).

To use ConfigCat, create a `.env` file from the schema:

```bash
cp .env.schema .env
```

> **Note**: This project uses [varlock](https://varlock.dev) for environment variable management. If you prefer to manage `.env` manually, you can simply copy `.env.schema` to `.env` and fill in the values.

And populate the following keys:
- `NEXT_PUBLIC_CONFIGCAT_SDK_KEY_PROD`: SDK Key for production environment.
- `NEXT_PUBLIC_CONFIGCAT_SDK_KEY_TEST`: SDK Key for development/testing.

#### Required ConfigCat Flags
If you decide to use ConfigCat, you must create the following feature flags in your ConfigCat dashboard with these exact keys and types:

| Flag Key | Type | Default Behavior (Without ConfigCat) | Description |
| :--- | :--- | :--- | :--- |
| `showGithubButton` | **Boolean** | `true` | Shows or hides the GitHub repository button in the header. |
| `showThemeToggle` | **Boolean** | `true` | Shows or hides the Dark/Light theme toggle button. |
| `maintenanceMode` | **Boolean** | `false` | Enables a full-screen "System Offline" overlay, blocking access to the app and halting API polling. |
| `maintenanceMessage` | **Text** | `"System is undergoing scheduled maintenance..."` | The message displayed when maintenance mode is active. |
| `maintenanceStartTime` | **Text** | `null` | A Unix Timestamp (e.g., `1716383400000`) representing when maintenance started. Used to show a synchronized "X since maintenance" timer globally. |
| `showAnnouncement` | **Boolean** | `false` | Shows a dismissible announcement banner at the top of the app. |
| `announcementMessage` | **Text** | `""` (Empty) | The markdown-supported text to display in the announcement banner. |

## Technical Specifications

- **Strict Typing**: TypeScript is used throughout the project.
- **Component Architecture**: Functional components with React hooks.
- **Performance**: Minimal client-side JavaScript; heavy use of Server Components where possible.
- **Accessibility**: Semantic HTML and keyboard-navigable interface.

## Contributing

This is a Free and Open Source Software (FOSS) project. Bug reports and pull requests should be submitted via GitHub.

**Important:** We use **Conventional Commits** to automate versioning and changelogs. Please ensure your commit messages follow the format `type: description` (e.g., `feat: add combat chart`).

For detailed instructions, see our [Contributing Guide](./CONTRIBUTING.md).

## License

MIT License. See `LICENSE` for the full text.

---
*Disclaimer: Not an official Torn City product.*
