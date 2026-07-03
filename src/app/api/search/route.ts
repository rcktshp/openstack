import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { SubmissionType, Platform } from "@/generated/prisma/client"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") ?? ""
  const type = searchParams.get("type") as SubmissionType | null
  const platform = searchParams.get("platform") as Platform | null
  const verified = searchParams.get("verified") === "true"
  const sort = searchParams.get("sort") ?? "trending"

  const where: any = {}

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { tags: { has: q.toLowerCase() } },
      { category: { contains: q, mode: "insensitive" } },
    ]
  }

  if (type) where.type = type
  if (platform) where.platforms = { has: platform }
  if (verified) where.verified = true

  const orderBy =
    sort === "newest"
      ? { createdAt: "desc" as const }
      : sort === "stars"
      ? { starCount: "desc" as const }
      : { starCount: "desc" as const }

  const results = await prisma.submission.findMany({
    where,
    orderBy,
    take: 48,
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  })

  return NextResponse.json({ results })
}
