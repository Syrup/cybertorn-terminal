# CyberTorn Terminal

A functional, high-density interface for the Torn City API. Built with Next.js and Tailwind CSS for players who prioritize data over aesthetics.

## Core Features

- **Character Monitoring**: Real-time tracking of battle stats, energy, nerve, and life.
- **Financial Ledger**: Detailed breakdown of cash, vault holdings, and total networth.
- **Operational Status**: Monitoring for crimes, attacks, and faction activities.
- **Asset Management**: View properties, stock holdings, and equipment.
- **Zero-Server Storage**: API keys are stored in your browser's local storage. Data is fetched directly from the Torn API.

## Technical Specifications

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4+ (Utility-first)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Font**: Monospace-heavy for data legibility

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
   Open [http://localhost:3000](http://localhost:3000) and enter your Torn API key.

## Technical Specifications

- **Runtime**: Bun (Primary) / Node.js (Fallback)
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4+ (Utility-first)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Font**: Monospace-heavy for data legibility

## Development Standards

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
