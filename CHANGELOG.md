# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/Syrup/cybertorn-terminal/compare/v1.2.0...v1.2.1) (2026-03-13)

## [1.2.0](https://github.com/Syrup/cybertorn-terminal/compare/v1.1.2...v1.2.0) (2026-03-13)


### Features

* add visibility toggle for API key input ([01016fd](https://github.com/Syrup/cybertorn-terminal/commit/01016fd283b656d1559e7edf67afd481381aa7ab))
* added item market section which lists up to 10 items. By default, shows 10 cheapest items sorted by market value. Includes a search feature. ([1077bd1](https://github.com/Syrup/cybertorn-terminal/commit/1077bd16d103f62bbaafe62e63c9da9b909a3d0c))
* animate refresh icon with play-state to preserve rotation angle ([c4b36dd](https://github.com/Syrup/cybertorn-terminal/commit/c4b36dd91db85a077b440e7c14359443d1d8dcd5))
* **equipment:** add low-resolution image notice and item visuals ([e558cc2](https://github.com/Syrup/cybertorn-terminal/commit/e558cc2e79da72764769c4a3432562c5c91fef64))
* **finance:** add warning banner for active loan shark accounts ([30f4349](https://github.com/Syrup/cybertorn-terminal/commit/30f434920de1ee8f4a089af2dc13595f343a1755))
* **profile:** improve job display with position and company details ([78bb59a](https://github.com/Syrup/cybertorn-terminal/commit/78bb59a4ce2e8018c42724a18a1dcaaf0815f24f))


### Bug Fixes

* **equipment:** hide ammo section for melee and armor items ([fb8f9dc](https://github.com/Syrup/cybertorn-terminal/commit/fb8f9dcf7df95123366f3ffb8bcaee7da5ea204d))

### [1.1.2](https://github.com/Syrup/cybertorn-terminal/compare/v1.1.1...v1.1.2) (2026-03-11)


### Bug Fixes

* resolve React error [#31](https://github.com/Syrup/cybertorn-terminal/issues/31) in FactionInfo and improve API input UX ([e475710](https://github.com/Syrup/cybertorn-terminal/commit/e47571036109ff227a696dc0120fb908bc3e55b0))

### [1.1.1](https://github.com/Syrup/cybertorn-terminal/compare/v1.1.0...v1.1.1) (2026-03-09)


### Bug Fixes

* resolve education course ID to display name ([70bcd01](https://github.com/Syrup/cybertorn-terminal/commit/70bcd017cf07e76ad9ccd2ad8e3df2cbe3ced3be))

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
