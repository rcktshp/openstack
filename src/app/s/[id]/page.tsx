import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { StarButton } from "@/components/star-button"
import { ForkButton } from "@/components/fork-button"
import { CommentSection } from "@/components/comment-section"
import {
  ShieldCheck,
  GitBranch,
  GitFork,
  ExternalLink,
  Calendar,
  Tag,
} from "lucide-react"
import { TYPE_LABELS, TYPE_COLORS, PLATFORM_LABELS } from "@/lib/types"
import { auth } from "@/lib/auth"

export default async function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          reputation: true,
        },
      },
      stars: session?.user?.id
        ? { where: { userId: session.user.id } }
        : false,
      _count: {
        select: { comments: true, forks: true },
      },
    },
  })

  if (!submission) notFound()

  const hasStarred = (submission.stars as any[])?.length > 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="outline"
                className={`text-[10px] font-medium px-2 py-0 ${TYPE_COLORS[submission.type]}`}
              >
                {TYPE_LABELS[submission.type]}
              </Badge>
              {submission.verified && (
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified by Rocketship</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{submission.title}</h1>
            <p className="text-white/60 leading-relaxed">{submission.description}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <StarButton
              submissionId={submission.id}
              initialCount={submission.starCount}
              initialStarred={hasStarred}
            />
            <ForkButton submissionId={submission.id} />
          </div>

          <Separator className="bg-white/8" />

          {/* Install Instructions */}
          <div>
            <h2 className="text-sm font-semibold text-white mb-3">Install Instructions</h2>
            <div className="rounded-xl bg-[oklch(0.11_0_0)] border border-white/8 p-5">
              <pre className="text-sm text-white/70 whitespace-pre-wrap font-mono leading-relaxed">
                {submission.installInstructions}
              </pre>
            </div>
          </div>

          {/* File Content */}
          {submission.fileContent && (
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">Content</h2>
              <div className="rounded-xl bg-[oklch(0.11_0_0)] border border-white/8 p-5 overflow-auto max-h-96">
                <pre className="text-xs text-white/60 whitespace-pre-wrap font-mono leading-relaxed">
                  {submission.fileContent}
                </pre>
              </div>
            </div>
          )}

          <Separator className="bg-white/8" />

          {/* Comments */}
          <CommentSection submissionId={submission.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Author */}
          <div className="rounded-xl border border-white/8 bg-[oklch(0.11_0_0)] p-5">
            <p className="text-xs text-white/40 mb-3">Created by</p>
            <Link href={`/profile/${submission.author.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Avatar className="h-9 w-9">
                <AvatarImage src={submission.author.image ?? ""} />
                <AvatarFallback className="bg-white/10 text-sm">
                  {submission.author.name?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">{submission.author.name}</p>
                <p className="text-xs text-white/40">{submission.author.reputation} rep</p>
              </div>
            </Link>
          </div>

          {/* Meta */}
          <div className="rounded-xl border border-white/8 bg-[oklch(0.11_0_0)] p-5 space-y-4">
            {submission.githubUrl && (
              <a
                href={submission.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <GitBranch className="h-4 w-4" />
                <span className="flex-1 truncate">View on GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <div className="flex items-center gap-2 text-sm text-white/40">
              <Calendar className="h-4 w-4" />
              <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <GitFork className="h-4 w-4" />
              <span>{submission._count.forks} forks</span>
            </div>
          </div>

          {/* Platforms */}
          <div className="rounded-xl border border-white/8 bg-[oklch(0.11_0_0)] p-5">
            <p className="text-xs text-white/40 mb-3">Platforms</p>
            <div className="flex flex-wrap gap-1.5">
              {submission.platforms.map((p: string) => (
                <span key={p} className="text-xs text-white/50 bg-white/6 rounded-full px-2.5 py-1">
                  {PLATFORM_LABELS[p as keyof typeof PLATFORM_LABELS] ?? p}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {submission.tags.length > 0 && (
            <div className="rounded-xl border border-white/8 bg-[oklch(0.11_0_0)] p-5">
              <p className="text-xs text-white/40 mb-3 flex items-center gap-1.5">
                <Tag className="h-3 w-3" /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {submission.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/explore?q=${tag}`}
                    className="text-xs text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 rounded-full px-2.5 py-1 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
