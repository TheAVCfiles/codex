# Migration Guide

This guide helps contributors understand the recent repository reorganization and how to adapt their workflows.

## What Changed?

As of October 2025, the TheAVCfiles/codex repository underwent a comprehensive reorganization to create a cohesive, stable foundation. Here's what happened:

### Branch Merges

The following feature branches were merged into `main`:

1. **codex/finalize-and-deliver-codex-folio-#001** → Added Ballet folio system
2. **codex/execute-emergency-content-generation-sprint** → Added emergency content generation playbook
3. **codex/set-up-environment-for-api** → Added FastAPI event logging infrastructure

### Conflict Resolution

- **README.md**: Merge conflicts were resolved by preserving DTG project documentation while maintaining Codex CLI documentation
- **Documentation files**: Grammar improvements were selectively applied where they improved clarity
- All new files were preserved and added to `main`

### Repository Structure

- **New file**: `REPOSITORY_STRUCTURE.md` documents the complete repository organization
- **Updated**: `README.md` cleaned up to remove merge conflict markers
- **Preserved**: All historical branches remain available for reference

## Impact on Existing Work

### If You Have an Open Pull Request

Your PR may have merge conflicts with the new `main` branch. Here's how to resolve them:

```bash
# 1. Fetch the latest changes
git fetch origin

# 2. Rebase your branch on the new main
git checkout your-feature-branch
git rebase origin/main

# 3. Resolve any conflicts
# Edit conflicted files, then:
git add <resolved-files>
git rebase --continue

# 4. Force push (since you rewrote history)
git push --force-with-lease origin your-feature-branch
```

### If You Have Local Changes

```bash
# 1. Stash your changes
git stash

# 2. Pull the new main
git checkout main
git pull origin main

# 3. Create a new branch
git checkout -b feature/your-feature

# 4. Apply your changes
git stash pop

# 5. Continue working
```

### If You Cloned a Feature Branch

Feature branches are preserved but may be out of date. Options:

**Option 1: Start fresh from main (recommended)**

```bash
git checkout main
git pull origin main
git checkout -b feature/your-new-feature
# Copy over your changes from the old branch if needed
```

**Option 2: Update your branch**

```bash
git checkout your-old-feature-branch
git merge origin/main
# Resolve conflicts as needed
```

## New Contribution Workflow

### 1. Always Start from Main

```bash
git checkout main
git pull origin main
git checkout -b feature/descriptive-name
```

### 2. Follow Naming Conventions

Use descriptive branch names:

- `feature/add-new-api-endpoint`
- `fix/resolve-memory-leak`
- `docs/update-setup-guide`
- `refactor/simplify-error-handling`

### 3. Keep Changes Focused

- One feature/fix per branch
- Related changes stay together
- Unrelated fixes go in separate PRs

### 4. Test Before Pushing

```bash
# Rust tests
cd codex-rs
cargo test
cargo clippy

# TypeScript tests
pnpm test
pnpm lint
pnpm typecheck

# Python tests (if applicable)
cd api
pytest
```

### 5. Document Your Changes

Update relevant documentation:

- Code comments for complex logic
- README.md for user-facing changes
- REPOSITORY_STRUCTURE.md for structural changes
- CHANGELOG.md for releases

## Project Structure Overview

### Core Components

```
codex/
├── codex-rs/          # Rust CLI (primary implementation)
├── codex-cli/         # TypeScript CLI (legacy)
├── api/               # FastAPI backend services
├── docs/              # Documentation
│   ├── codex-de-ballet/  # Ballet folio system
│   └── *.md          # Guides and specs
├── data/              # Project data files
├── public/            # Web demos
├── scripts/           # Automation scripts
└── .github/           # CI/CD workflows
```

### Key Files

- **REPOSITORY_STRUCTURE.md**: Complete structure documentation
- **README.md**: Main project documentation
- **AGENTS.md**: Custom agent instructions
- **CHANGELOG.md**: Version history
- **MIGRATION_GUIDE.md**: This file

## Common Tasks

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Implement changes
# ... make your changes ...

# 3. Test thoroughly
pnpm test && pnpm lint
cd codex-rs && cargo test

# 4. Commit with clear message
git commit -m "feat: add awesome feature

- Added X functionality
- Updated Y documentation
- Tests pass"

# 5. Push and create PR
git push origin feature/my-feature
# Open PR on GitHub
```

### Fixing a Bug

```bash
# 1. Create fix branch
git checkout -b fix/bug-description

# 2. Write a test that reproduces the bug
# 3. Fix the bug
# 4. Verify test passes
# 5. Commit and push
```

### Updating Documentation

```bash
# 1. Create docs branch
git checkout -b docs/update-guide

# 2. Make documentation changes
# 3. Verify formatting and links
# 4. Commit and push
```

## Breaking Changes

### Removed Content

The following were removed during reorganization (not added by the reorganization effort):

- Some draft documentation that was superseded
- Experimental code that wasn't ready
- Duplicate files from branch conflicts

If you need access to removed content, check the git history:

```bash
git log --all --full-history -- path/to/file
git show commit-hash:path/to/file
```

### Changed Paths

No paths were changed in this reorganization. All existing paths remain valid.

## Getting Help

### If You're Stuck

1. **Check existing documentation**

   - README.md
   - REPOSITORY_STRUCTURE.md
   - This migration guide

2. **Review recent commits**

   ```bash
   git log --oneline --graph -20
   ```

3. **Ask for help**
   - Open a GitHub Discussion
   - Comment on relevant issues
   - Tag maintainers in your PR

### If You Find Issues

1. **Document the problem**

   - What you expected
   - What actually happened
   - Steps to reproduce

2. **Check if it's a regression**

   ```bash
   git bisect start
   git bisect bad HEAD
   git bisect good origin/main~10
   ```

3. **Open an issue**
   - Use issue templates
   - Include reproduction steps
   - Link to related PRs/commits

## FAQ

### Q: Why was my branch not merged?

A: We merged branches that added new content or features. Branches that primarily removed content or had duplicate changes were not merged to avoid regression. Your branch is preserved for reference.

### Q: Can I still work on my old feature branch?

A: Yes, but you'll need to merge or rebase with the new `main` branch. We recommend starting a fresh branch from the new `main`.

### Q: Where did file X go?

A: Check the git history: `git log --all --full-history -- path/to/file`. It may have been removed if it was superseded or duplicated.

### Q: How do I know what's in main now?

A: Read `REPOSITORY_STRUCTURE.md` for a complete overview, or run:

```bash
git log --oneline --graph -20
```

### Q: My tests are failing after the merge

A: This shouldn't happen as all tests passed in the reorganization. But if they are:

1. Run `pnpm install` to update dependencies
2. Run `cargo clean && cargo build` for Rust
3. Check for local configuration issues
4. Open an issue if problems persist

### Q: Can I propose reverting something?

A: Yes! Open an issue or PR with:

- Clear explanation of the problem
- Why reverting helps
- Alternative solutions considered

## Timeline

- **October 12, 2025**: PR #9 merged (DTG infrastructure)
- **October 13, 2025**: Repository reorganization completed
  - Ballet folio system merged
  - Emergency sprint playbook merged
  - FastAPI infrastructure merged
  - Documentation created

## Support

For questions or issues related to this migration:

- **Issues**: [GitHub Issues](https://github.com/TheAVCfiles/codex/issues)
- **Discussions**: [GitHub Discussions](https://github.com/TheAVCfiles/codex/discussions)
- **Security**: See SECURITY.md for vulnerability reporting

---

_Last Updated: October 2025_  
_Maintainers: TheAVCfiles organization_
