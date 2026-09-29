#project guidelines
-**Stack**: Node.js,JavaScript/TypeScript
-**Conventions**:Conventional commits, clean modular architecture


# Project Rules

1. **Form Architecture:** All interactive forms MUST use `react-hook-form` with a companion `zod` schema. Never generate uncontrolled native inputs or inline regex validation.
2. **Accessibility Standard:** Every form input MUST feature an explicit `id`, an associated `<label htmlFor="...">`, and conditional `aria-invalid` / `aria-describedby` props targeting field error containers.
3. **Verification Loop:** When generating or refactoring UI components, always generate corresponding Vitest/React Testing Library unit tests covering both the happy path and invalid boundary inputs.
