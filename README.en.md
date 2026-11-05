# Taskhub — Calendar & Task Planner for Microsoft Edge

A calendar-first personal task planner built as a Manifest V3 browser extension for Microsoft Edge. It includes bilingual UI, custom categories and colors, date-range events, recurring tasks, Excel import, daily reminders, task statuses, important-task stars, an Edge side panel, and a standalone browser window.

[中文版 README](README.md)

> Current repository version: **v1.7.0**.  **Repository visibility: Public · No license.** The source is visible but no open-source reuse license is granted.

## Features

- Monthly calendar and list views.
- Chinese and English interface switching.
- Custom task categories with preset color swatches and custom colors.
- Single-day and multi-day events displayed as calendar bars.
- Daily, weekly, monthly, and custom-interval recurring schedules. Generated occurrences can be managed individually.
- Bulk task import using `Taskhub_Import_Template.xlsx`, with a preview before import.
- Pending, completed, and manually marked incomplete states. Overdue pending tasks roll forward to today without duplicating the record or overwriting its original dates.
- Important-task ⭐ markers across the calendar, list, and side panel.
- Multiple daily reminder times delivered through Edge notifications.
- Edge native side panel, full dashboard, and a separate browser window.
- Local persistence using the browser extension storage API.

## Project structure

```text
Taskhub/
├── manifest.json
├── background.js
├── index.html
├── app.js
├── app.css
├── sidepanel.html
├── sidepanel.js
├── sidepanel.css
├── icons/
├── Taskhub_Import_Template.xlsx
├── docs/
├── CHANGELOG.md
├── README.md
└── README.en.md
```

## Install in Microsoft Edge

1. Download and extract this repository, or clone it with Git.
2. Open `edge://extensions/` in Microsoft Edge.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project root folder containing `manifest.json`.
6. Pin Taskhub to the toolbar. Clicking the extension icon opens the side panel.

See [Installation and updates](docs/INSTALL.md) for details.

## Data and privacy

Taskhub stores tasks and reminder settings locally with `chrome.storage.local`. The current version does not provide cloud accounts or cross-device synchronization. Your personal task data is stored in your local Edge profile and is not included in this source repository unless you explicitly add a backup file.

See [Data and permissions](docs/DATA_AND_PRIVACY.md).

## Development and issue reports

The extension uses plain HTML, CSS, and JavaScript; no build step is required. Repository maintainers and authorized developers can reload the extension at `edge://extensions/` after editing.

Issues and feature suggestions are welcome. Code contributions require separately agreed permissions; this repository does not grant a general license for source reuse or modifications. Do not commit private task backups, account details, or other personal information.

## License and reuse (No license)

**No software license has been granted, and there is no `LICENSE` file in this repository.** Public visibility does not make the project open source. Under GitHub's Terms of Service, GitHub users may view and fork public repositories on the platform, but no additional permission to copy, modify, redistribute, or commercially reuse the code is granted by a software license. Applicable legal exceptions and independently obtained permissions are unaffected.

See [GitHub Docs: Licensing a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).
