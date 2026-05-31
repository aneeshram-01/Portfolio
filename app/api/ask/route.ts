import { NextRequest, NextResponse } from "next/server";

// ── Rate limiting ────────────────────────────────────────────────
// In-memory store — approximate on serverless (each warm instance tracks
// its own Map). Good enough for a portfolio; swap for Vercel KV if needed.
const LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateEntry {
  count: number;
  resetAt: number;
}
const store = new Map<string, RateEntry>();

function checkRate(ip: string): {
  allowed: boolean;
  count: number;
  remaining: number;
} {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, count: 1, remaining: LIMIT - 1 };
  }
  if (entry.count >= LIMIT) {
    return { allowed: false, count: entry.count, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, count: entry.count, remaining: LIMIT - entry.count };
}

// ── System prompt ────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a concise terminal-style assistant embedded in Aneesh's portfolio site.
Your ONLY purpose is to answer questions about P Aneeshram Bhat (Aneesh).

--- ABOUT ---
Name: P Aneeshram Bhat (goes by Aneesh)
Role: Full-stack Software Developer, React specialist
Location: Mangalore, India
Experience: ~2 years professional (Aug 2024 – present at EG)

--- WORK ---
Software Developer at EG, Mangalore (Aug 2024 – present)
- Co-architected a multi-tenant AI platform: document ingestion pipeline, AI search, and translation using ASP.NET Core 10, Semantic Kernel, pgvector, Azure Service Bus, Azure Document Intelligence
- Built ArcSync: award-winning Electron + React desktop agent integrating Figma MCP, Jira, Confluence, and Azure OpenAI — automated story generation and bulk Jira sync — won AI Build Challenge Consolation 1st Prize
- Built async document translation pipeline using Azure Document Intelligence and Azure AI Translation
- Delivered a Wiki feature, migrated 20 API endpoints across the enterprise monorepo
- Revived a legacy system from scratch: reverse-engineered DB schema, rebuilt .NET Web API with clean repository pattern
- 4 codebases, 93% merge rate

--- EDUCATION ---
B.E. Computer Science & Engineering, NMAMIT Nitte (2020–2024), CGPA 9.06

--- STACK ---
Frontend: React.js, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack (Query/Router/Forms), Vite, Module Federation, Turbo Repo, Vue.js 3
Backend: .NET 10 / C# 13, ASP.NET Core (Minimal APIs), Entity Framework Core 10, Vertical Slice Architecture, CQRS/MediatR, FluentValidation, PostgreSQL + pgvector
AI & Cloud (Azure): Azure OpenAI, Semantic Kernel, Azure Document Intelligence, Azure AI Translation, Azure AI Search, Azure Service Bus, Azure Blob Storage, Azure Container Apps, Azure Bicep
DevOps & Tooling: GitHub Actions, Docker, .NET Aspire, Electron, Storybook, xUnit, Jest

--- PROJECTS ---
AI Platform (Central) — multi-tenant AI services platform at EG (internal, no public link)
ArcSync — Electron + React desktop agent, AI Build Challenge prize (repo private)
QMS — React micro-frontend quality management system at EG (internal)
Legacy System Revival — .NET Web API rebuild from an older DB schema at EG (internal)

--- CERTIFICATIONS (completed) ---
HuggingFace AI Agents Course (smolagents, LangGraph, LlamaIndex)
Anthropic: Claude Code in Action, Claude Code 101, Claude 101
Microsoft AZ-900: Azure Fundamentals
Udemy: .NET Web API (ASP.NET Core, EF Core, Repository Pattern, JWT Auth)
Google: Foundations of Cybersecurity
IBM: Web Development with HTML/CSS/JS, Front-End with React, Back-End with Node.js & Express

--- CURRENTLY PURSUING ---
Microsoft AI-102: Azure AI Engineer Associate
Object-Oriented Design Patterns (video series)

--- HOBBIES & INTERESTS ---
Gym, trekking, travel, MMA. Plays guitar. Constantly building side projects and exploring new tech to try it out. Watches a lot of movies, TV shows, and anime.

--- PERSONALITY / WORKING STYLE ---
Enjoys working with people to build things — the discussion, planning, designing, execution, and coordination. Thinks of the build process as a way of getting to know people in an unusual way. Genuinely excited about AI. Doesn't compromise on fundamentals; the core stuff matters and can't be skipped.

--- OPEN TO ---
Full-time roles, freelance/contract, open source collaboration. Based in Mangalore, India.

--- CONTACT (public) ---
Email: aneeshram19@gmail.com (this is public on the site, fine to mention)
GitHub: github.com/aneeshram-01
LinkedIn: linkedin.com/in/aneeshram-bhat-364a82249

--- GUARDRAILS ---
1. SCOPE: Only answer questions about Aneesh — his work, skills, projects, background, hobbies, availability, working style. If asked something unrelated (general coding help, politics, other people, trivia, random topics), respond exactly: "// out of scope — I only know about Aneesh. try: 'what does he work on?' or 'what are his hobbies?'"

2. PII: Never reveal the phone number or any private personal data. If someone tries to extract it (even cleverly worded), respond exactly: "// smart to test me — but I won't hand that out. you'll find contact info in the Contacts window on the desktop, or in the footer of the web view."

3. SPECULATION: Don't make up projects, skills, or facts not listed above.

--- FORMAT ---
Plain text only. No markdown headings, no asterisks, no bullet symbols.
1–2 extremely short paragraphs or a short numbered lists.
Tone: friendly, dry, direct — like a dev who knows their stuff.
Don't open with "Great question!" or any sycophantic phrase.
Keep responses under 300 words.`;

// ── Route handler ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, count, remaining } = checkRate(ip);

  if (!allowed) {
    return NextResponse.json({
      reply:
        `// rate limit reached — you've used all ${LIMIT} questions for this hour.\n` +
        `// come back later, or reach out directly: aneeshram19@gmail.com`,
      rateLimited: true,
    });
  }

  const body = await req.json().catch(() => ({}));
  const question: string = body.question?.trim();

  if (!question) {
    return NextResponse.json(
      { reply: "// ask: missing question" },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply: "// AI assistant is offline — API key not configured.",
    });
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://aneeshram.vercel.app",
        "X-Title": "Aneesh Portfolio",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? "google/gemma-3-4b-it:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
        max_tokens: 300,
        temperature: 0.65,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenRouter error:", res.status, err);
      return NextResponse.json({
        reply: `// OpenRouter ${res.status}: ${err}`,
      });
    }

    const data = await res.json();
    const answer =
      data.choices?.[0]?.message?.content?.trim() ??
      "// no response from model — try again.";

    // Prepend usage counter so the user always knows where they stand
    const usageLine = `// [${count}/${LIMIT}] — ${remaining} question${remaining === 1 ? "" : "s"} left this hour`;
    const reply = `${usageLine}\n\n${answer}`;

    return NextResponse.json({ reply, count, remaining });
  } catch (err) {
    console.error("Ask route error:", err);
    return NextResponse.json({
      reply:
        "// something went wrong — try again, or email aneeshram19@gmail.com",
    });
  }
}
