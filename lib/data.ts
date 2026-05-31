// All typed site content — single source of truth.
// No `window.*` globals: components import directly from here.

/* ----------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------- */

export interface Project {
  id: string;
  num: string;
  title: string;
  year: string;
  desc: string;
  tag: string;
  tech: string[];
  link?: string; // undefined = no public link
  linkLabel?: string; // 'GitHub' | 'Live' | 'Demo' | '// repo private'
  award?: string; // e.g. 'AI Build Challenge · Consolation 1st Prize'
  isPersonal: boolean; // true = Personal Projects section; false = Work (under Experience)
}

export interface CvEntry {
  when: string;
  role: string;
  where: string;
  bullets: string[];
  type: "work" | "education";
}

export interface StackGroup {
  label: string;
  items: string[];
}

export interface Cert {
  title: string;
  issuer: string;
  status: "completed" | "in-progress" | "planned";
  link?: string; // certificate URL — user will populate
}

export interface Post {
  date: string;
  title: string;
  meta: string;
}

/* ----------------------------------------------------------------------------
 * Personal / site info
 * ------------------------------------------------------------------------- */

export const PROFILE = {
  name: "P Aneeshram Bhat",
  shortName: "Aneeshram Bhat",
  title: "Software Developer",
  role: "Software Developer · Full-stack · React specialist",
  location: "Mangalore, India",
  email: "aneeshram19@gmail.com",
  phone: "+91 7204713308",
  github: "https://github.com/aneeshram-01",
  githubLabel: "github/aneeshram-01",
  // TODO: confirm — placeholder until corrected
  linkedin: "https://www.linkedin.com/in/aneeshram-bhat-364a82249/",
  linkedinLabel: "linkedin/aneeshram",
  domain: "aneeshram.vercel.app",
  available: true,
} as const;

export const HERO = `Full-stack Software Engineer with nearly 2 years of experience building production web applications and cloud-native systems. React.js specialist with hands-on backend and Azure experience; currently co-building a multi-tenant AI platform using Semantic Kernel, pgvector, and ASP.NET Core 10.`;

/* ----------------------------------------------------------------------------
 * Experience + Education (timeline)
 * ------------------------------------------------------------------------- */

export const CV: CvEntry[] = [
  {
    when: "Aug 2024 — Present",
    role: "Software Developer",
    where: "EG · Mangalore, India",
    type: "work",
    bullets: [
      "Co-architected multi-tenant document ingestion and AI search features on a shared AI services platform using ASP.NET Core 10, Azure Service Bus, pgvector, and Microsoft Semantic Kernel; built the full ingestion worker pipeline.",
      "Built and shipped ArcSync, award-winning Electron + React desktop agent integrating Figma MCP, Jira, Confluence, and Azure OpenAI; automated frontend/backend story generation and bulk Jira backlog sync.",
      "Built async AI document translation pipeline supporting multiple extensions using Azure Document Intelligence and AI Translation.",
      "Architected the extensible settings module; config-driven routing utilities that became the foundation pattern for all subsequent feature modules.",
      "Delivered a full Wiki feature and contributed to an API endpoint migration across 20 files in the Enterprise monorepo.",
      "Revived a legacy system lost during handoff; reverse-engineered backend logic from an older DB schema and rebuilt the .NET Web API using clean repository pattern.",
      "Worked across 4 codebases with overall 93% merge rate.",
    ],
  },
  {
    when: "Dec 2020 — 2024",
    role: "B.E., Computer Science and Engineering",
    where:
      "NMAM Institute of Technology (NMAMIT), Nitte — Udupi District, India · CGPA 9.06",
    type: "education",
    bullets: [],
  },
];

/* ----------------------------------------------------------------------------
 * Projects
 *   Work projects (isPersonal: false) render under the Experience section.
 *   Personal projects (isPersonal: true) render as a standalone section.
 * ------------------------------------------------------------------------- */

export const PROJECTS: Project[] = [
  // -- Work (EG) --------------------------------------------------------------
  {
    id: "ai-platform",
    num: "01",
    title: "AI Platform (Central)",
    year: "2025",
    tag: "AI Platform",
    desc: "Multi-tenant shared AI services platform: document ingestion worker pipeline, AI search, and translation built on a vertical-slice ASP.NET Core backend with pgvector and Semantic Kernel.",
    tech: [
      "ASP.NET Core 10",
      "Semantic Kernel",
      "pgvector",
      "Azure Service Bus",
      "Azure Document Intelligence",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
    ],
    isPersonal: false,
  },
  {
    id: "arcsync",
    num: "02",
    title: "ArcSync",
    year: "2025",
    tag: "Desktop Agent",
    desc: "Award-winning Electron + React desktop agent that integrates Figma MCP, Jira, and Confluence with Azure OpenAI to automate frontend/backend story generation and bulk Jira backlog sync.",
    tech: [
      "Electron",
      "React 18",
      "Zustand",
      "TanStack",
      "C# Minimal APIs",
      "Azure OpenAI",
      "Figma MCP",
      "Jira API",
      "Confluence API",
    ],
    award: "AI Build Challenge · Consolation 1st Prize",
    isPersonal: false,
  },
  {
    id: "qms",
    num: "03",
    title: "Quality Management System (QMS)",
    year: "2025",
    tag: "Micro-frontend",
    desc: "Module-federated quality management system with a shared design system, built in a Turbo Repo monorepo with isolated feature modules.",
    tech: [
      "React.js",
      "Turbo Repo",
      "Module Federation",
      "TanStack",
      "shadcn/ui",
      "Zustand",
      "Storybook",
      "Jest",
    ],
    isPersonal: false,
  },
  {
    id: "legacy-revival",
    num: "04",
    title: "Legacy System Revival",
    year: "2024",
    tag: "Backend",
    desc: "Revived a legacy system lost during handoff: reverse-engineered backend logic from an older DB schema and rebuilt the .NET Web API with a clean repository pattern.",
    tech: [
      "ASP.NET Core",
      "C#",
      "EF Core",
      "MSSQL",
      "React.js",
      "shadcn/ui",
      "TanStack",
    ],
    isPersonal: false,
  },

  // -- Personal ---------------------------------------------------------------
  {
    id: "arcsync-personal",
    num: "01",
    title: "ArcSync",
    year: "2025",
    tag: "Desktop Agent",
    desc: "Electron + React desktop agent integrating Figma MCP, Jira, Confluence, and Azure OpenAI. Submitted to the internal AI Build Challenge",
    tech: [
      "Electron",
      "React 18",
      "Zustand",
      "TanStack",
      "Azure OpenAI",
      "Figma MCP",
    ],
    award: "AI Build Challenge · Consolation 1st Prize",
    linkLabel: "// repo private",
    isPersonal: true,
  },
  {
    id: "soon-1",
    num: "02",
    title: "Coming soon",
    year: "2026",
    tag: "// placeholder",
    desc: "// coming soon — a personal project will live here.",
    tech: [],
    linkLabel: "// coming soon",
    isPersonal: true,
  },
  {
    id: "soon-2",
    num: "03",
    title: "Coming soon",
    year: "2026",
    tag: "// placeholder",
    desc: "// coming soon — a personal project will live here.",
    tech: [],
    linkLabel: "// coming soon",
    isPersonal: true,
  },
];

export const WORK_PROJECTS = PROJECTS.filter((p) => !p.isPersonal);
export const PERSONAL_PROJECTS = PROJECTS.filter((p) => p.isPersonal);

/* ----------------------------------------------------------------------------
 * Stack — 4 labelled groups
 * ------------------------------------------------------------------------- */

export const STACK: StackGroup[] = [
  {
    label: "Frontend",
    items: [
      "React.js",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Zustand",
      "TanStack (Query · Router · Forms)",
      "Vite",
      "Module Federation",
      "Turbo Repo",
      "Vue.js 3",
    ],
  },
  {
    label: "Backend",
    items: [
      ".NET 10 / C# 13",
      "ASP.NET Core (Minimal APIs)",
      "Entity Framework Core 10",
      "Vertical Slice Architecture",
      "CQRS / MediatR",
      "FluentValidation",
      "PostgreSQL + pgvector",
    ],
  },
  {
    label: "AI & Cloud (Azure)",
    items: [
      "Azure OpenAI",
      "Semantic Kernel",
      "Azure Document Intelligence",
      "Azure AI Translation",
      "Azure AI Search",
      "Azure Service Bus",
      "Azure Blob Storage",
      "Azure Container Apps",
      "Azure Bicep",
    ],
  },
  {
    label: "DevOps & Tooling",
    items: [
      "GitHub Actions (CI/CD)",
      "Docker",
      ".NET Aspire",
      "Electron",
      "Storybook",
      "xUnit",
      "Jest",
    ],
  },
];

/* ----------------------------------------------------------------------------
 * Certifications
 * ------------------------------------------------------------------------- */

export const CERTS: Cert[] = [
  // Completed
  {
    title: "AI Agents Course (smolagents, LangGraph, LlamaIndex)",
    issuer: "HuggingFace",
    status: "completed",
    link: "https://cas-bridge.xethub.hf.co/xet-bridge-us/6800ea554845e4edbca48825/8dc96ee26c984357c7e8b4cc37e2671bb8de0ba71cfd804eeee55c2f1b6a5419?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cas%2F20260531%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260531T191503Z&X-Amz-Expires=3600&X-Amz-Signature=1418e9aa709561f7c5b73dd2ac2abaf59fa28587a88f840166cf429f50de98c5&X-Amz-SignedHeaders=host&X-Xet-Cas-Uid=public&response-content-disposition=inline%3B+filename*%3DUTF-8%27%272026-05-30.png%3B+filename%3D%222026-05-30.png%22%3B&response-content-type=image%2Fpng&x-amz-checksum-mode=ENABLED&x-id=GetObject&Expires=1780258503&Policy=eyJTdGF0ZW1lbnQiOlt7IkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc4MDI1ODUwM319LCJSZXNvdXJjZSI6Imh0dHBzOi8vY2FzLWJyaWRnZS54ZXRodWIuaGYuY28veGV0LWJyaWRnZS11cy82ODAwZWE1NTQ4NDVlNGVkYmNhNDg4MjUvOGRjOTZlZTI2Yzk4NDM1N2M3ZThiNGNjMzdlMjY3MWJiOGRlMGJhNzFjZmQ4MDRlZWVlNTVjMmYxYjZhNTQxOSoifV19&Signature=bpf7eUNJsPP1idgOg6FaiVWhMyMKIIfpfYypLcvVYw9HdZph7aUr-McBKNTyxlf7AXyGOVaT0jP6-LEmSng9oVF6Dbq24n1u9d9N3Ub-AkjDYZVHySwYtZVjxEPb1U%7El-CFlvNdLDWgJGSUF%7Ezc25UEDg-uI%7EU4Od9ywBEal-XMwknuJdkyh2ps0CRd5n675y6wX%7EEkBieOhVVx1rOjEEUwZ1rFcVpKVzZ3Gxy8Tuq5hZ0ml2dXuU5ymjaWtfs9MWQdnnaexEuysCJ9d4tZOjHOfTyynuTYNAwhaZq4UHuhsAIMUex6pU7ZON0vkXdwaNkLGX0GO0Tt83SJW5W7D0Q__&Key-Pair-Id=K2L8F4GPSG1IFC",
  },
  {
    title: "Claude Code in Action",
    issuer: "Anthropic",
    status: "completed",
    link: "https://verify.skilljar.com/c/76c6o2svpv3o",
  },
  {
    title: "Claude Code 101",
    issuer: "Anthropic",
    status: "completed",
    link: "https://verify.skilljar.com/c/6pikju5ysor8",
  },
  {
    title: "Claude 101",
    issuer: "Anthropic",
    status: "completed",
    link: "https://verify.skilljar.com/c/vo5etrx6keis",
  },
  {
    title: "AZ-900: Azure Fundamentals",
    issuer: "Microsoft",
    status: "completed",
    link: "https://learn.microsoft.com/en-us/users/aneeshrambhat-2583/credentials/75e469dee3be992f?ref=https%3A%2F%2Fwww.linkedin.com%2F",
  },
  {
    title: ".NET Web API (ASP.NET Core, EF Core, Repository Pattern, JWT Auth)",
    issuer: "Udemy",
    status: "completed",
    link: "https://www.udemy.com/certificate/UC-a6291849-adc0-4db0-8718-45c499994429/",
  },
  {
    title: "Foundations of Cybersecurity",
    issuer: "Google",
    status: "completed",
    link: "https://www.coursera.org/account/accomplishments/verify/NTRUWYAQYXH3",
  },
  {
    title: "Web Development with HTML, CSS, JS",
    issuer: "IBM",
    status: "completed",
    link: "https://www.coursera.org/account/accomplishments/verify/VU4AKU5B46LP",
  },
  {
    title: "Front-End with React",
    issuer: "IBM",
    status: "completed",
    link: "https://www.coursera.org/account/accomplishments/verify/EGAXD5TVGBVP",
  },
  {
    title: "Back-End with Node.js & Express",
    issuer: "IBM",
    status: "completed",
    link: "https://www.coursera.org/account/accomplishments/verify/F8B79GHPJ6AG",
  },

  // In progress / planned
  {
    title: "AI-102: Azure AI Engineer Associate",
    issuer: "Microsoft",
    status: "in-progress",
  },
  {
    title: "AZ-305: Azure Solutions Architect Expert",
    issuer: "Microsoft",
    status: "planned",
  },
  {
    title: "Claude Architect Certification",
    issuer: "Anthropic",
    status: "planned",
  },
  {
    title: "Object-Oriented Design Patterns (Strategy, Observer, Decorator, …)",
    issuer: "Video series",
    status: "in-progress",
  },
];

export const COMPLETED_CERTS = CERTS.filter((c) => c.status === "completed");
export const PLANNED_CERTS = CERTS.filter((c) => c.status !== "completed");

/* ----------------------------------------------------------------------------
 * Writing — intentionally empty (section removed)
 * ------------------------------------------------------------------------- */

export const POSTS: Post[] = [];
