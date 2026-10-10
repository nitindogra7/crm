# Contributing to Salenova

Thank you for your interest in contributing to **Salenova**! We appreciate community contributions to help make developer-first lead capture simple, resilient, and fast.

Please review this guide before submitting issues or pull requests.

---

## 1. Code of Conduct

We expect all contributors to adhere to a welcoming, respectful, and inclusive environment. Harassment or exclusionary behavior will not be tolerated.

---

## 2. Development Workflow

### 2.1 Branch Naming Conventions

Always create a new branch from `main` with a descriptive prefix:

- `feat/feature-name`: New features or enhancements (e.g., `feat/webhook-dispatcher`)
- `fix/issue-description`: Bug fixes (e.g., `fix/honeypot-casing-sensitivity`)
- `docs/topic-name`: Documentation updates (e.g., `docs/api-guide`)
- `refactor/scope`: Code refactoring without changing functionality (e.g., `refactor/auth-schemas`)
- `perf/scope`: Performance optimizations

### 2.2 Conventional Commits

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature for the user or developer
- `fix:` A bug fix
- `docs:` Documentation-only changes
- `style:` Formatting, missing semicolons, white-space changes
- `refactor:` Code refactoring that neither fixes a bug nor adds a feature
- `perf:` Changes that improve performance
- `test:` Adding or updating tests
- `chore:` Maintenance tasks, dependency updates, build configurations

**Example Commit Message**:
```
feat(api): add honeypot validation and disposition tagging
```

---

## 3. Pull Request Guidelines

1. **Keep PRs Focused**: One logical feature or bugfix per PR. Avoid bundling unrelated modifications.
2. **Run Lint and Type Checks**:
   - For client:
     ```bash
     cd client && pnpm run lint
     ```
   - For server: Ensure TypeScript compiles cleanly.
3. **Reference Issues**: Use keywords like `Closes #12` or `Fixes #34` in the pull request description.
4. **Fill out the PR Template**: Clearly summarize what changes were made and how they were tested.

---

## 4. Coding Standards

### Frontend (`/client`)
- Use **Next.js 16 App Router** conventions. Default to Server Components unless client-side interactivity, state, or hooks are necessary.
- Mark interactive components with `"use client";` at the top of the file.
- Use **Tailwind CSS v4** utility classes for styling.
- Store components within their respective domain folders in `src/features/<feature>/components` rather than creating a flat monolith.

### Backend (`/server`)
- Write strictly typed TypeScript code. Avoid `any` types; prefer union types or generics.
- Keep route handlers thin; separate database access into services or Prisma queries.
- Ensure all public-facing errors do not leak stack traces or raw database connection strings.

---

## 5. Submitting Issues

If you encounter a bug or have a suggestion:
1. Search existing issues to ensure it hasn't already been reported.
2. Open a new issue using our **Bug Report** or **Feature Request** template.
3. Provide reproduction steps, expected behavior, and screenshots where applicable.
