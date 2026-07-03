import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { SubmissionType, Platform } from "@/generated/prisma/client"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const {
    title,
    description,
    type,
    platforms,
    category,
    tags,
    githubUrl,
    fileContent,
    installInstructions,
  } = body

  if (!title || !description || !type || !platforms || !category || !installInstructions) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const submission = await prisma.submission.create({
    data: {
      title,
      description,
      type: type as SubmissionType,
      platforms: platforms as Platform[],
      category,
      tags: tags ?? [],
      githubUrl: githubUrl ?? null,
      fileContent: fileContent ?? null,
      installInstructions,
      authorId: session.user.id,
    },
  })

  // Award reputation points
  await prisma.user.update({
    where: { id: session.user.id },
    data: { reputation: { increment: 10 } },
  })

  return NextResponse.json({ submission })
}
