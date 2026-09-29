# AI Workflow Diff Analysis: Profile Settings Form

## 1. Correctness & Code Quality
- **Round 1 (Vague):** The model produced basic uncontrolled inputs with rudimentary regex checks written inline inside `handleSubmit`. It missed state synchronization on reset and failed to sanitize inputs.
- **Round 2 (Spec-Driven):** Using `react-hook-form` paired with a strict `zod` schema ensured type safety, explicit type inference, and centralized error handling.

## 2. Accessibility (a11y) & Edge Cases
- **Round 1:** The generated markup lacked `<label>` associations via `htmlFor`, omitted `aria-invalid` and `aria-describedby` attributes for error messaging, and truncated long text without overflow handling.
- **Round 2:** All form controls received explicit labels, error messages linked via `aria-describedby`, and keyboard navigation functioned cleanly. Edge cases (such as whitespace-only submissions and boundary character limits) were handled defensively.

## 3. Caught AI Mistakes
- **Vague Run:** The model hallucinated a mock API submission function that silently succeeded without returning rejected promise states, leaving no UI path for network failure handling.
- **Spec Run:** The initial test setup failed because the model omitted a mock for `matchMedia`. The verification loop caught this immediately in the terminal, prompting a targeted fix before human review.

## 4. Review Effort & Time-to-Merge
- **Round 1:** Generation took ~15 seconds, but code review and debugging uncovered 4 silent logic flaws that would require ~20 minutes of manual refactoring.
- **Round 2:** Planning and generating took ~2 minutes, but with automated unit test verification passing out-of-the-box, final code review took under 3 minutes. Spec-first prompting inverted the time spent from debugging to upfront clarity.
