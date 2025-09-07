/**
 * Codimir Codec SDK — Short Prompt Generation (SPG)
 *
 * Converts noisy inputs (typed/voice today) into compact, role-aware prompts
 * ready for the Codimir fabric. This is a minimal, local SDK scaffold.
 */

export type IntentClass = 'code' | 'spec' | 'review' | 'deploy' | 'chat'

export interface ShortPromptInput {
  readonly input: string
  readonly context?: {
    readonly project?: string
    readonly repo?: string
  }
}

export interface ShortPromptResult {
  readonly shortPrompt: string
  readonly roleHints: readonly string[]
  readonly meta: {
    readonly intent: IntentClass
    readonly entities: readonly string[]
  }
}

/**
 * Derive a compact, high-signal prompt from raw input with role hints.
 * Keep this fast and deterministic; heavier NLP belongs in the fabric.
 */
export function shortPrompt(params: ShortPromptInput): ShortPromptResult {
  const { input } = params
  const normalized: string = normalize(input)
  const intent: IntentClass = classifyIntent(normalized)
  const entities: readonly string[] = extractEntities(normalized)
  const roleHints: readonly string[] = suggestRoles(intent)
  const shortPrompt: string = synthesize(normalized, intent, entities)
  return { shortPrompt, roleHints, meta: { intent, entities } }
}

const normalize = (s: string): string => s.trim().replace(/^computer[,:\s]+/i, '').replace(/^codimir[,:\s]+/i, '')

function classifyIntent(s: string): IntentClass {
  const lower: string = s.toLowerCase()
  if (/\b(review|pr|diff|lint|refactor)\b/.test(lower)) return 'review'
  if (/\b(spec|design|acceptance|requirements|doc)\b/.test(lower)) return 'spec'
  if (/\b(deploy|release|publish)\b/.test(lower)) return 'deploy'
  if (/\b(fix|implement|add|create|update|remove|build)\b/.test(lower)) return 'code'
  return 'chat'
}

function extractEntities(s: string): readonly string[] {
  const entities: string[] = []
  const pr = s.match(/\bpr\s*#?(\d+)\b/i)
  if (pr) entities.push(`PR#${pr[1]}`)
  const file = s.match(/\b([A-Za-z0-9_\-/]+\.[a-z]{1,8})\b/)
  if (file) entities.push(file[1])
  const area = s.match(/\b(dashboard|auth|billing|search|editor)\b/i)
  if (area) entities.push(area[0])
  return entities
}

function suggestRoles(intent: IntentClass): readonly string[] {
  switch (intent) {
    case 'review':
      return ['eng.code-review'] as const
    case 'spec':
      return ['pm.growth'] as const
    case 'deploy':
      return ['ops.deploy'] as const
    case 'code':
      return ['eng.implement'] as const
    default:
      return ['pm.growth'] as const
  }
}

function synthesize(s: string, intent: IntentClass, entities: readonly string[]): string {
  const base: string = s.length > 280 ? `${s.slice(0, 277)}...` : s
  const ent = entities.length ? ` (${entities.join(', ')})` : ''
  switch (intent) {
    case 'review':
      return `Review for correctness, security, and performance: ${base}${ent}`
    case 'spec':
      return `Draft a concise spec with acceptance criteria: ${base}${ent}`
    case 'deploy':
      return `Prepare deployment plan with checks: ${base}${ent}`
    case 'code':
      return `Implement change with tests: ${base}${ent}`
    default:
      return base
  }
}
