# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.1.0 (2026-03-08)


### Features

* add Vercel Analytics to root layout ([751a8ed](https://github.com/Syrup/cybertorn-terminal/commit/751a8ed26d0f129396d031b5b07588e3b1b642e6))
* **flags,ui:** integrate ConfigCat and improve dashboard UI ([1b5f494](https://github.com/Syrup/cybertorn-terminal/commit/1b5f494e3f1c35dcfd6a823683f61d72164c7ea2))
* improve dashboard layout and merge combat stats with tabs ([3cad977](https://github.com/Syrup/cybertorn-terminal/commit/3cad9772a7473374ad057b6d4b73c1a079d0de25))
* migrate to Bun as primary runtime with npm fallback ([1bebc9c](https://github.com/Syrup/cybertorn-terminal/commit/1bebc9cf487ab1f41075e5881c7afc48970526bc))
* release v1.0.0 with automated versioning and polling update ([6f8c749](https://github.com/Syrup/cybertorn-terminal/commit/6f8c749f454d70e7660a19c5f4b80cdb46cde8de))
* **ui:** refine dashboard UI and maintenance handling ([ab2f8cc](https://github.com/Syrup/cybertorn-terminal/commit/ab2f8cc21ab8c0f2cc16946d1eb1d8baac717b04)), closes [#3](https://github.com/Syrup/cybertorn-terminal/issues/3)


### Bug Fixes

* revert to @vercel/analytics/next as per documentation and local build success ([acda0a8](https://github.com/Syrup/cybertorn-terminal/commit/acda0a88a906c86f206cb29aa25711cbde84199f))
* use correct import for Vercel Analytics ([cc4095a](https://github.com/Syrup/cybertorn-terminal/commit/cc4095a0e30fb0604bd41d5038141e9a95384b09))

## [1.0.0] - 2026-03-08

### Added
- **Initial Stable Release**: CyberTorn Terminal is now production-ready.
- **Torn City Integration**: Full dashboard with Profile, Battle Stats, Networth, and more.
- **Visual Data**: Added Combat Win/Loss ratio charts and web-based data visualization.
- **Feature Flags**: Integrated ConfigCat for remote management of UI elements (Maintenance Mode, Theme Toggle, etc.).
- **Modern UI**: Sleek terminal-themed design using Tailwind CSS 4 and Lucide icons.
- **Analytics**: Integrated Vercel Analytics for usage monitoring.
- **Runtime**: Full support for Bun as the primary runtime for faster development and testing.

### Changed
- **Branding**: Rebranded from "Torn Dashboard" to "CyberTorn Terminal".
- **Performance**: Optimized polling interval and dashboard loading states.
- **Structure**: Improved project organization with dedicated test directories and clean component architecture.

### Fixed
- Various UI layout issues on mobile devices.
- Vercel Analytics import and configuration.
- Maintenance mode overlay behavior.

---
