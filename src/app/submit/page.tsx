"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Upload, ChevronRight } from "lucide-react"
import { PLATFORMS, CATEGORIES, TYPE_LABELS } from "@/lib/types"
import type { SubmissionType, Platform } from "@/lib/types"

const STEPS = ["Type", "Details", "Source", "Review"]

export default function SubmitPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [type, setType] = useState<SubmissionType | "">("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [tags, setTags] = useState("")
  const [sourceType, setSourceType] = useState<"github" | "upload">("github")
  const [githubUrl, setGithubUrl] = useState("")
  const [fileContent, setFileContent] = useState("")
  const [installInstructions, setInstallInstructions] = useState("")

  if (status === "loading") return null
  if (!session) {
    router.push("/login")
    return null
  }

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    )
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        type,
        platforms,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        githubUrl: sourceType === "github" ? githubUrl : null,
        fileContent: sourceType === "upload" ? fileContent : null,
        installInstructions,
      }),
    })
    const data = await res.json()
    if (data.submission) {
      router.push(`/s/${data.submission.id}`)
    }
    setSubmitting(false)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white mb-1">Submit to OpenStack</h1>
        <p className="text-sm text-white/40">Share your skill, plugin, or agent with the community.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                i < step
                  ? "bg-white text-black"
                  : i === step
                  ? "bg-white/20 text-white ring-1 ring-white/40"
                  : "bg-white/8 text-white/30"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`text-xs ${i === step ? "text-white" : "text-white/30"}`}>{s}</span>
            {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-white/20" />}
          </div>
        ))}
      </div>

      {/* Step 0: Type */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-white/60 mb-6">What are you submitting?</p>
          <div className="grid grid-cols-3 gap-3">
            {(["SKILL", "PLUGIN", "AGENT"] as SubmissionType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-xl border p-5 text-left transition-all ${
                  type === t
                    ? "border-white/40 bg-white/8"
                    : "border-white/8 hover:border-white/20 bg-transparent"
                }`}
              >
                <div className="text-sm font-medium text-white mb-1">{TYPE_LABELS[t]}</div>
                <div className="text-xs text-white/40">
                  {t === "SKILL" && "SKILL.md, slash commands, workflows"}
                  {t === "PLUGIN" && "MCP servers, tool integrations"}
                  {t === "AGENT" && "Autonomous agent systems"}
                </div>
              </button>
            ))}
          </div>
          <Button
            onClick={() => setStep(1)}
            disabled={!type}
            className="w-full bg-white text-black hover:bg-white/90 mt-4"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. "Code Review Skill" or "Figma MCP Plugin"`}
              className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does it do? Who is it for?"
              rows={3}
              className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                    category === c
                      ? "bg-white text-black border-white"
                      : "border-white/12 text-white/50 hover:text-white/80 bg-transparent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => togglePlatform(value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    platforms.includes(value)
                      ? "bg-white text-black border-white"
                      : "border-white/12 text-white/50 hover:text-white/80 bg-transparent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Tags (comma separated)</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. review, typescript, claude"
              className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep(0)} className="border-white/15 text-white/60 bg-transparent">
              Back
            </Button>
            <Button
              onClick={() => setStep(2)}
              disabled={!title || !description || !category || platforms.length === 0}
              className="flex-1 bg-white text-black hover:bg-white/90"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Source */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setSourceType("github")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl border p-4 text-sm transition-all ${
                sourceType === "github"
                  ? "border-white/40 bg-white/8 text-white"
                  : "border-white/8 text-white/40 hover:border-white/20 bg-transparent"
              }`}
            >
              <GitBranch className="h-4 w-4" />
              GitHub Repo
            </button>
            <button
              onClick={() => setSourceType("upload")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl border p-4 text-sm transition-all ${
                sourceType === "upload"
                  ? "border-white/40 bg-white/8 text-white"
                  : "border-white/8 text-white/40 hover:border-white/20 bg-transparent"
              }`}
            >
              <Upload className="h-4 w-4" />
              Direct Upload
            </button>
          </div>

          {sourceType === "github" ? (
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">GitHub Repository URL</label>
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Paste content (SKILL.md, config, etc.)</label>
              <Textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                placeholder="Paste your SKILL.md or config content here..."
                rows={10}
                className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30 resize-none font-mono text-xs"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Install Instructions</label>
            <Textarea
              value={installInstructions}
              onChange={(e) => setInstallInstructions(e.target.value)}
              placeholder="How do users install or use this? Step-by-step."
              rows={4}
              className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep(1)} className="border-white/15 text-white/60 bg-transparent">
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={(!githubUrl && !fileContent) || !installInstructions}
              className="flex-1 bg-white text-black hover:bg-white/90"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="rounded-xl border border-white/10 bg-[oklch(0.11_0_0)] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] border-white/20 text-white/60">
                {type}
              </Badge>
              <span className="text-white font-medium">{title}</span>
            </div>
            <p className="text-sm text-white/50">{description}</p>
            <div className="flex flex-wrap gap-1.5">
              {platforms.map((p) => (
                <span key={p} className="text-[10px] text-white/30 bg-white/5 rounded px-2 py-0.5">
                  {PLATFORMS.find((x) => x.value === p)?.label}
                </span>
              ))}
            </div>
            <div className="text-xs text-white/30 capitalize">{category}</div>
            {githubUrl && (
              <div className="text-xs text-white/30 font-mono">{githubUrl}</div>
            )}
          </div>

          <p className="text-xs text-white/40">
            Your submission will be live immediately. Rocketship may add a{" "}
            <span className="text-emerald-400">Verified</span> badge after review.
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)} className="border-white/15 text-white/60 bg-transparent">
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-white text-black hover:bg-white/90"
            >
              {submitting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
