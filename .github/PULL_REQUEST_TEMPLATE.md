## Summary

<!-- What does this PR do, and why? One or two sentences. -->

## Changes

<!-- Bullet the notable changes. -->
-

## Testing

<!-- How did you verify this? Paste `npm test` results, and any manual/live checks. -->
- [ ] `npm test` passes

## Checklist

<!-- Delete rows that don't apply. See CONTRIBUTING.md for the full bar. -->
- [ ] Docs updated in the same PR — the relevant `docs/` file, a dated `docs/CHANGELOG.md` entry, and `README.md` / `docs/installation.md` if setup or first-use changed
- [ ] Follows project conventions — synchronous `better-sqlite3` (no `async/await` for DB), additive `CREATE TABLE IF NOT EXISTS` / `ALTER TABLE` in `try/catch` (no migration framework), epoch-ms integer timestamps, `INTEGER` 0/1 booleans, `(db) => router` route factories
- [ ] **Part counts are sacred** — if this touches job completion, recovery, or operator confirmation, explain how it avoids double-crediting `completed_qty`
- [ ] **Printer driver PRs** — state the test hardware, link the protocol docs you worked from, implement the four-function interface, and add driver tests that mock the network layer (see `docs/driver-authoring.md`)

<!-- A before/after screenshot is appreciated for any visible UI change. -->
