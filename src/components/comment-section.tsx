"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type Comment = {
  id: string
  body: string
  createdAt: string
  user: { id: string; name: string | null; image: string | null }
  replies: Comment[]
}

export function CommentSection({ submissionId }: { submissionId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = async () => {
    const res = await fetch(`/api/submissions/${submissionId}/comments`)
    const data = await res.json()
    setComments(data.comments ?? [])
  }

  useEffect(() => { fetchComments() }, [submissionId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) { router.push("/login"); return }
    if (!body.trim()) return
    setSubmitting(true)
    await fetch(`/api/submissions/${submissionId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    })
    setBody("")
    await fetchComments()
    setSubmitting(false)
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-white mb-5">
        Comments ({comments.length})
      </h2>

      {/* New comment */}
      <form onSubmit={handleSubmit} className="mb-6">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={session ? "Leave a comment..." : "Sign in to comment"}
          disabled={!session}
          rows={3}
          className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30 resize-none mb-2"
        />
        {session && (
          <Button
            type="submit"
            disabled={submitting || !body.trim()}
            size="sm"
            className="bg-white text-black hover:bg-white/90"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        )}
      </form>

      {/* Comments list */}
      <div className="space-y-5">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-7 w-7 shrink-0 mt-0.5">
              <AvatarImage src={comment.user.image ?? ""} />
              <AvatarFallback className="bg-white/10 text-[10px]">
                {comment.user.name?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-white">{comment.user.name}</span>
                <span className="text-xs text-white/30">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{comment.body}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-white/30">No comments yet. Be the first.</p>
        )}
      </div>
    </div>
  )
}
