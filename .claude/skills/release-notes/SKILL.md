---
name: release-notes
description: Generate release notes from git commits between two tags, following Conventional Commits and Keep a Changelog format. Use when the user asks to generate a changelog, release notes, or prepare a release.
---

# Release Notes Generator

## Steps

1. Determine the commit range: ask the user for the previous tag (or run
   `git describe --tags --abbrev=0` to find the latest tag automatically),
   and use `<previous-tag>..HEAD` as the range.

2. Fetch commits: run `git log <range> --pretty=format:"%s"` to get commit
   subjects only.

3. Categorize each commit by its Conventional Commits prefix:
   - `feat:` → Added
   - `fix:` → Fixed
   - `refactor:` or `perf:` → Changed
   - `chore:`, `docs:`, `test:`, `ci:` → exclude from the changelog

4. Format the output as Markdown, Keep a Changelog style:
   ## Added
   - <description, prefix stripped, capitalized>

   ## Fixed
   - ...

   ## Changed
   - ...

   Omit any section with no entries.

5. Show the result to the user. If they confirm, offer to run
   `gh release create <new-tag> --notes-file <file>` to publish it.
