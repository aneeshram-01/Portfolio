// Stubbed AI client. The Ask widget (web) and terminal `ask` command both call
// `complete()`. At launch there is no API call — it resolves to an offline notice.
//
// Future: wire this to a Next.js `/api/ask` route backed by ANTHROPIC_API_KEY.
// See .env.local.example and PORTFOLIO_MIGRATION.md § Out of Scope.

export const OFFLINE_MESSAGE = `// AI assistant is offline in this build.
// Coming soon — email aneeshram19@gmail.com in the meantime.`;

/**
 * Stubbed completion. Accepts a prompt (ignored) and resolves to the offline
 * message after a tiny delay so callers' "thinking" UI still flashes naturally.
 */
export async function complete(_prompt?: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return OFFLINE_MESSAGE;
}
