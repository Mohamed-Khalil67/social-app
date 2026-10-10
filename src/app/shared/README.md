# Shared Module (`src/app/shared`)

The `shared` directory contains reusable, stateless, presentational UI building blocks, formatting pipes, custom directives, and PrimeNG UI wrapper components.

---

## Architecture Rules
1. **Zero Business Logic**: Components in `shared/` must be pure and presentational (dumb components).
2. **Reactivity Contract**:
   - Receive data via `input()` signals.
   - Emit user events via `output()` signals.
   - Must NOT inject feature-specific services or make direct domain API calls.
3. **Universally Accessible**: Any feature component or layout can import elements from `shared/`.

---

## Directory Breakdown

### `components/`
Reusable generic UI components that are not tied to a single feature.
- **Examples**:
  - `confirm-dialog/`: Generic confirmation modal wrapper.
  - `avatar/`: User avatar component with fallback initials and online indicator.
  - `empty-state/`: Placeholder view for empty feeds, search results, or notifications.
  - `spinner/`: Custom loading indicator.

### `pipes/`
Pure data transformation pipes.
- **Angular Best Practice**: Keep pipes pure. Prefer built-in pipes (`DatePipe`, `DecimalPipe`) where possible.
- **Examples**:
  - `time-ago.pipe.ts`: Transforms ISO dates into human-readable strings (e.g., "5m ago", "2h ago").
  - `truncate.pipe.ts`: Truncates long text strings with ellipses (`...`).

### `directives/`
Reusable DOM manipulation and behavioral directives.
- **Angular Best Practice**: Use the `host` property in `@Directive` instead of `@HostListener` or `@HostBinding`.
- **Examples**:
  - `autofocus.directive.ts`: Automatically focuses an input element when mounted.
  - `image-fallback.directive.ts`: Replaces broken images with a default placeholder.

### `ui/`
PrimeNG pre-configured UI wrappers and custom Tailwind styled widgets.
- **Examples**:
  - `button/`: Customized PrimeNG `p-button` with default styling and iconography.
  - `input/`: Standard text-box wrappers with floating labels and validation error display.
