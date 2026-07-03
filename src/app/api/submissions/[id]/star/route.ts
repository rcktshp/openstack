import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.star.findUnique({
    where: { userId_submissionId: { userId: session.user.id, submissionId: id } },
  })

  if (existing) {
    await prisma.star.delete({ where: { id: existing.id } })
    const updated = await prisma.submission.update({
      where: { id },
      data: { starCount: { decrement: 1 } },
    })
    return NextResponse.json({ starred: false, count: updated.starCount })
  } else {
    await prisma.star.create({
      data: { userId: session.user.id, submissionId: id },
    })
    const updated = await prisma.submission.update({
      where: { id },
      data: { starCount: { increment: 1 } },
    })
    // Reward author
    const submission = await prisma.submission.findUnique({ where: { id }, select: { authorId: true } })
    if (submission) {
      await prisma.user.update({
        where: { id: submission.authorId },
        data: { reputation: { increment: 2 } },
      })
    }
    return NextResponse.json({ starred: true, count: updated.starCount })
  }
}
