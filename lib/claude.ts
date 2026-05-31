// AI client — calls /api/ask which hits OpenRouter server-side.
// Falls back to OFFLINE_MESSAGE on any network or config error.

export const OFFLINE_MESSAGE =
  '// AI assistant is offline in this build.\n' +
  '// Coming soon — email aneeshram19@gmail.com in the meantime.';

export const RATE_LIMIT_MESSAGE =
  '// rate limit reached — you\'ve used all 10 questions for this hour.\n' +
  '// come back later, or reach out directly: aneeshram19@gmail.com';

/**
 * Send a question to /api/ask and return the reply string.
 * Always resolves — errors fall back to OFFLINE_MESSAGE so callers
 * don't need their own try/catch.
 */
export async function complete(question: string): Promise<string> {
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) return OFFLINE_MESSAGE;

    const data = await res.json();
    return data.reply ?? OFFLINE_MESSAGE;
  } catch {
    return OFFLINE_MESSAGE;
  }
}
