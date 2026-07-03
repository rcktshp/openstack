import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SubmissionCard } from "@/components/submission-card"
import { GitBranch, Globe, AtSign, Trophy } from "lucide-react"
import type { Submission } from "@/generated/prisma/client"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      submissions: {
        orderBy: { starCount: "desc" },
        include: { author: { select: { id: true, name: true, image: true } } },
      },
    },
  })

  if (!user) notFound()

  const totalStars = user.submissions.reduce((acc: number, s: { starCount: number }) => acc + s.starCount, 0)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Profile header */}
      <div className="flex items-start gap-5 mb-10">
        <Avatar className="h-16 w-16 ring-1 ring-white/20">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback className="bg-white/10 text-xl">{user.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{user.name}</h1>
          {user.bio && <p className="text-sm text-white/50 mt-1 max-w-md">{user.bio}</p>}
          <div className="flex items-center gap-4 mt-3">
            {user.github && (
              <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors">
                <GitBranch className="h-4 w-4" />
              </a>
            )}
            {user.twitter && (
              <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors">
                <AtSign className="h-4 w-4" />
              </a>
            )}
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors">
                <Globe className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        {/* Reputation */}
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end text-yellow-400 mb-1">
            <Trophy className="h-4 w-4" />
            <span className="text-lg font-bold">{user.reputation}</span>
          </div>
          <p className="text-xs text-white/30">reputation</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Submissions", value: user.submissions.length },
          { label: "Total Stars", value: totalStars },
          { label: "Verified", value: user.submissions.filter((s: { verified: boolean }) => s.verified).length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-white/8 bg-[oklch(0.11_0_0)] p-4 text-center">
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-white/40 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Submissions */}
      <h2 className="text-sm font-semibold text-white mb-4">Submissions</h2>
      {user.submissions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.submissions.map((s: Submission & { author: { id: string; name: string | null; image: string | null } }) => (
            <SubmissionCard key={s.id} {...s} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/30">No submissions yet.</p>
      )}
    </div>
  )
}
