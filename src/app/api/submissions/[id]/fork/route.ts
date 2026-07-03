import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { title, description, fileContent, githubUrl } = await req.json()

  const fork = await prisma.fork.create({
    data: {
      title,
      description,
      fileContent,
      githubUrl,
      userId: session.user.id,
      submissionId: id,
    },
  })

  await prisma.submission.update({
    where: { id },
    data: { forkCount: { increment: 1 } },
  })

  return NextResponse.json({ fork })
}
