# personal-development

## Project Structure

The source tree is organized by ownership instead of by file type:

```text
src/
  app/              App shell, global layout, and route definitions
  features/         Feature-owned pages, components, hooks, and styles
    auth/
    home/
    robot/
  shared/           Cross-feature config, services, and styles
    config/
    services/
    styles/
  test/             Test setup and global test utilities
```

Guidelines:

- Put feature-specific code inside `src/features/<feature-name>/`.
- Put reusable app-wide code inside `src/shared/`.
- Keep routing in `src/app/routes.tsx`.
- Prefer `@/*` imports over long relative paths.
