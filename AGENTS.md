<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Course content (nav, lessons, labs) lives in `src/content/*`; pages render it through shared components in `src/components/lab/*`, so new lessons need only data + a thin route file.
- Routing stays on TanStack Router (file routes), not HashRouter, because the app framework is fixed.
