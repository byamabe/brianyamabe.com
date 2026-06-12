---
name: do-work
description: Structured workflow for implementing a unit of work in the brianyamabe.com repository. Covers planning, implementation, TypeScript + test feedback loops, and a final commit. Use when given a feature, bug fix, or task to implement in this repo — any request that results in changed code that should be committed.
---

# Do Work

Full implementation workflow for this repository: plan → implement → verify → commit.

## 1. Plan

Before writing any code:

- Read `CONTEXT.md` for domain vocabulary and V1 scope
- Read any relevant files the task touches (composables, components, JSON, server routes)
- State your implementation plan in 3–5 bullet points
- Identify which files will change and why

Do not skip this step. A one-paragraph plan prevents wrong-direction implementation.

## 2. Implement

Follow project conventions:

- **Stack**: Nuxt 4 / Vue 3 / TypeScript strict / raw Three.js (no TresJS)
- **Styles**: scoped `<style>` in Vue SFCs, consistent with InfoPanel palette (`#e8d5b7` text, `rgba(26,20,16,0.88)` bg)
- **3D geometry**: add to `useThreeWorld.ts` following the existing Group → Mesh → scene.add pattern
- **Landmark data**: JSON files under `content/landmarks/`; zone registration in `useThreeWorld.ts`; wiring in `index.vue`
- **No comments** unless the WHY is non-obvious

## 3. Feedback loops

Run these in order after each meaningful change. Fix before moving on.

### TypeScript
```bash
pnpm exec nuxi typecheck 2>&1 | grep -v "synod-stories.get.ts"
```
> Known pre-existing errors in `synod-stories.get.ts` are filtered. Any other errors must be fixed.

### Tests
```bash
pnpm run test 2>&1 || echo "no test suite — skip"
```
> No test suite currently exists. When one is added, this step becomes mandatory.

### Visual (when touching 3D or UI)
Use the `verify` or `run` skill to screenshot the dev server and confirm the golden path renders correctly. The dev server is at `http://localhost:3000` (or 3001 if port conflict).

Repeat the feedback loop until typecheck is clean and the feature looks right.

## 4. Commit

Only after feedback loops pass:

```bash
git add <specific files>   # never git add -A
git commit -m "$(cat <<'EOF'
<imperative subject line, ≤72 chars>

<optional body: what changed and why, not how>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push
```

Subject line style matches repo history: `Add ...`, `Fix ...`, `Replace ...`. Check `git log --oneline -5` if unsure.

## Known gotchas

- `new RegExp(templateString)` requires doubled backslashes (`\\s` not `\s`)
- Pointer lock doesn't engage in headless Playwright — test zone triggers by timing sprints or injecting state
- `SYNOD_STORIES_RSS_URL` env var must be set for the RSS route to fetch; empty array is the correct fallback
- Pre-existing TS errors in `synod-stories.get.ts` — do not fix as part of unrelated work
