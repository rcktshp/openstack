import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, GitFork, ShieldCheck } from "lucide-react"
import { TYPE_LABELS, TYPE_COLORS, PLATFORM_LABELS } from "@/lib/types"
import type { SubmissionType, Platform } from "@/lib/types"

type SubmissionCardProps = {
  id: string
  title: string
  description: string
  type: SubmissionType
  platforms: Platform[]
  category: string
  tags: string[]
  starCount: number
  forkCount: number
  verified: boolean
  author: {
    id: string
    name: string | null
    image: string | null
  }
  createdAt: Date
}

export function SubmissionCard({
  id,
  title,
  description,
  type,
  platforms,
  category,
  starCount,
  forkCount,
  verified,
  author,
  tags,
}: SubmissionCardProps) {
  return (
    <Link href={`/s/${id}`}>
      <div className="group relative rounded-xl border border-white/8 bg-[oklch(0.11_0_0)] p-5 hover:border-white/20 hover:bg-[oklch(0.13_0_0)] transition-all duration-200 cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`text-[10px] font-medium px-2 py-0 ${TYPE_COLORS[type]}`}
            >
              {TYPE_LABELS[type]}
            </Badge>
            {verified && (
              <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                <span>Verified</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-white/40 text-xs shrink-0">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {starCount}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-3 w-3" />
              {forkCount}
            </span>
          </div>
        </div>

        {/* Title + desc */}
        <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={author.image ?? ""} />
              <AvatarFallback className="text-[10px] bg-white/10">
                {author.name?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-white/40 text-xs">{author.name}</span>
          </div>
          <div className="flex gap-1 flex-wrap justify-end">
            {platforms.slice(0, 2).map((p) => (
              <span key={p} className="text-[10px] text-white/30 bg-white/5 rounded px-1.5 py-0.5">
                {PLATFORM_LABELS[p]}
              </span>
            ))}
            {platforms.length > 2 && (
              <span className="text-[10px] text-white/30">
                +{platforms.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
