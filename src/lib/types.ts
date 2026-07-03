import { SubmissionType, Platform } from "@/generated/prisma/client"

export type { SubmissionType, Platform }

export const SUBMISSION_TYPES = ["SKILL", "PLUGIN", "AGENT"] as const

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "CLAUDE_CODE", label: "Claude Code" },
  { value: "CODEX", label: "Codex" },
  { value: "CURSOR", label: "Cursor" },
  { value: "WINDSURF", label: "Windsurf" },
  { value: "GEMINI_CLI", label: "Gemini CLI" },
  { value: "ALL", label: "All Platforms" },
]

export const CATEGORIES = [
  "productivity",
  "devtools",
  "research",
  "design",
  "writing",
  "data",
  "automation",
  "security",
  "testing",
  "deployment",
  "other",
]

export const PLATFORM_LABELS: Record<Platform, string> = {
  CLAUDE_CODE: "Claude Code",
  CODEX: "Codex",
  CURSOR: "Cursor",
  WINDSURF: "Windsurf",
  GEMINI_CLI: "Gemini CLI",
  ALL: "All Platforms",
}

export const TYPE_LABELS: Record<SubmissionType, string> = {
  SKILL: "Skill",
  PLUGIN: "Plugin",
  AGENT: "Agent",
}

export const TYPE_COLORS: Record<SubmissionType, string> = {
  SKILL: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PLUGIN: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  AGENT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
}
