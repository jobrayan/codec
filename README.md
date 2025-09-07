# Codimir Codec SDK

Telepathy capture — Thought→Code SDK for **Short Prompt Generation (SPG)** and fabric bindings.

This package provides utilities to compress noisy inputs (typed/voice today, neural later) into compact, role-aware prompts designed to plug into Codimir’s agent fabric.

- SPG: normalize → extract intent → synthesize minimal prompt
- Role hints: suggest roles like `eng.code-review`, `pm.growth`
- Policy filters: optional budget/safety gating

## Status

- v0: local SDK scaffolding for docs and prototypes
- Intended to be published later as open-source

## Example

```ts
import { shortPrompt } from 'codimir-codec'

const res = shortPrompt({
  input: 'Computer, review PR #42 for performance issues in the dashboard',
  context: { project: 'codimir', repo: 'codimir-app' },
})

console.log(res)
// {
//   shortPrompt: 'Review PR #42 focusing on dashboard performance.',
//   roleHints: ['eng.code-review'],
//   meta: { intent: 'review', entities: ['PR#42', 'dashboard'] }
// }
```

## License

Apache-2.0
