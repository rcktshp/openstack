"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SubmissionCard } from "@/components/submission-card"
import { TYPE_LABELS, PLATFORM_LABELS } from "@/lib/types"
import type { SubmissionType, Platform } from "@/lib/types"

const TYPES: SubmissionType[] = ["SKILL", "PLUGIN", "AGENT"]
const PLATFORMS: Platform[] = ["CLAUDE_CODE", "CODEX", "CURSOR", "WINDSURF", "GEMINI_CLI", "ALL"]
const SORTS = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest" },
  { value: "stars", label: "Most Starred" },
]

function ExploreContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [typeFilter, setTypeFilter] = useState<SubmissionType | "">("")
  const [platformFilter, setPlatformFilter] = useState<Platform | "">("")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState("trending")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchResults = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (typeFilter) params.set("type", typeFilter)
    if (platformFilter) params.set("platform", platformFilter)
    if (verifiedOnly) params.set("verified", "true")
    params.set("sort", sort)

    const res = await fetch(`/api/search?${params}`)
    const data = await res.json()
    setResults(data.results ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchResults()
  }, [typeFilter, platformFilter, verifiedOnly, sort])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchResults()
    const params = new URLSearchParams(searchParams)
    if (query) params.set("q", query)
    else params.delete("q")
    router.push(`/explore?${params}`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, plugins, agents..."
            className="h-11 pl-11 pr-4 bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30 rounded-xl text-sm"
          />
        </div>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Type */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTypeFilter("")}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              typeFilter === ""
                ? "bg-white text-black border-white"
                : "border-white/12 text-white/50 hover:text-white/80 bg-transparent"
            }`}
          >
            All Types
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(typeFilter === t ? "" : t)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                typeFilter === t
                  ? "bg-white text-black border-white"
                  : "border-white/12 text-white/50 hover:text-white/80 bg-transparent"
              }`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Verified */}
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            verifiedOnly
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              : "border-white/12 text-white/50 hover:text-white/80 bg-transparent"
          }`}
        >
          ✓ Verified
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          {SORTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                sort === s.value
                  ? "bg-white/10 text-white border-white/20"
                  : "border-white/8 text-white/40 hover:text-white/60 bg-transparent"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-white/4 animate-pulse" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((r) => (
            <SubmissionCard key={r.id} {...r} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-white/30 text-sm">No results found.</p>
          <p className="text-white/20 text-xs mt-1">Try a different search or clear filters.</p>
        </div>
      )}
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  )
}
