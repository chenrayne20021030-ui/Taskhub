# Release checklist

Before publishing a new Taskhub version:

- [ ] Update `version` in `manifest.json`.
- [ ] Update `CHANGELOG.md` and README feature/version notes.
- [ ] Keep existing storage keys and data fields backward-compatible where possible.
- [ ] Test calendar rendering in Chinese and English.
- [ ] Test create, edit, delete, date ranges, recurring schedules, and task status transitions.
- [ ] Test important-task stars and pending-task counts.
- [ ] Test Excel template download, preview, validation, and import.
- [ ] Test reminder settings and Edge notifications.
- [ ] Test side panel, full dashboard, and separate window.
- [ ] Check `manifest.json` permissions and document any new permission.
- [ ] Check the ZIP archive and ensure `manifest.json` is at the archive root.
- [ ] Confirm the chosen publishing model is **Public + No license**; do not add a `LICENSE` file or describe the project as licensed open source.
- [ ] Verify that `README.md` and `README.en.md` correctly describe the absence of a reuse license.
- [ ] Verify that no personal task backups or private information are included.
- [ ] Upgrade an existing local Edge installation without uninstalling it, and verify that data remains available.
