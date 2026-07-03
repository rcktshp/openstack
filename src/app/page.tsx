"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Layers } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const TRENDING_SEARCHES = [
  "code review",
  "figma",
  "research",
  "git workflow",
  "slack",
  "testing",
  "deployment",
]

export default function HomePage() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleTrending = (term: string) => {
    router.push(`/explore?q=${encodeURIComponent(term)}`)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 border border-white/10">
          <Layers className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white leading-none">OpenStack</h1>
          <p className="text-xs text-white/40 mt-0.5">by Rocketship</p>
        </div>
      </div>

      <p className="text-white/60 text-sm text-center mb-10 max-w-sm leading-relaxed">
        The open-source registry for AI skills, plugins &amp; agents.
        <br />
        Built by the community. Curated by Rocketship.
      </p>

      <form onSubmit={handleSearch} className="w-full max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, plugins, agents..."
            className="h-12 pl-11 pr-4 bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30 rounded-xl text-sm focus-visible:ring-white/20 focus-visible:border-white/30"
          />
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
        <span className="text-xs text-white/30">Trending:</span>
        {TRENDING_SEARCHES.map((term) => (
          <button
            key={term}
            onClick={() => handleTrending(term)}
            className="text-xs text-white/40 hover:text-white/70 transition-colors px-2.5 py-1 rounded-full border border-white/8 hover:border-white/20 bg-transparent cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-8 mt-16 text-center">
        {[
          { label: "Skills", value: "0" },
          { label: "Plugins", value: "0" },
          { label: "Agents", value: "0" },
          { label: "Contributors", value: "0" },
        ].map(({ label, value }) => (
          <div key={label}>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-2">
        <Badge variant="outline" className="border-white/12 text-white/30 text-[10px] bg-transparent">
          Open Source
        </Badge>
        <Badge variant="outline" className="border-white/12 text-white/30 text-[10px] bg-transparent">
          Community Owned
        </Badge>
        <Badge variant="outline" className="border-white/12 text-white/30 text-[10px] bg-transparent">
          Free Forever
        </Badge>
      </div>
    </div>
  )
}
