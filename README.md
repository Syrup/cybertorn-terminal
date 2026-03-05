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
   git clone https://github.com/your-username/cybertorn-terminal.git
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

The project integrates with [ConfigCat](https://configcat.com/) for remote feature toggling and maintenance mode. To use it, create a `.env` file from the example:

```bash
cp .env.example .env
```

And populate the following keys:
- `NEXT_PUBLIC_CONFIGCAT_SDK_KEY_PROD`: SDK Key for production environment.
- `NEXT_PUBLIC_CONFIGCAT_SDK_KEY_TEST`: SDK Key for development/testing.

**Note**: If these variables are not provided, the application will default to:
- All features enabled (GitHub button, Theme toggle).
- Maintenance mode disabled.

## Technical Specifications

- **Strict Typing**: TypeScript is used throughout the project.
- **Component Architecture**: Functional components with React hooks.
- **Performance**: Minimal client-side JavaScript; heavy use of Server Components where possible.
- **Accessibility**: Semantic HTML and keyboard-navigable interface.

## Contributing

This is a Free and Open Source Software (FOSS) project. Bug reports and pull requests should be submitted via GitHub.

1. Fork the repository.
2. Create a branch for your changes.
3. Ensure the code passes linting (`bun run lint`).
4. Submit a pull request with a concise description of the changes.

## License

MIT License. See `LICENSE` for the full text.

---
*Disclaimer: Not an official Torn City product.*
