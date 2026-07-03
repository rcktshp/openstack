"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GitFork } from "lucide-react"

export function ForkButton({ submissionId }: { submissionId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fileContent, setFileContent] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleFork = async () => {
    if (!session) {
      router.push("/login")
      return
    }
    setSubmitting(true)
    await fetch(`/api/submissions/${submissionId}/fork`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, fileContent, githubUrl }),
    })
    setOpen(false)
    setSubmitting(false)
  }

  return (
    <>
      <Button
        onClick={() => {
          if (!session) { router.push("/login"); return }
          setOpen(true)
        }}
        variant="outline"
        className="gap-2 border-white/15 bg-transparent text-white/60 hover:text-white hover:border-white/30 text-sm"
      >
        <GitFork className="h-4 w-4" />
        Fork + Suggest
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[oklch(0.11_0_0)] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Fork + Suggest Improvement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What did you improve?"
                className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your changes..."
                rows={3}
                className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30 resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">GitHub URL (optional)</label>
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Updated Content (optional)</label>
              <Textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                placeholder="Paste your improved version..."
                rows={5}
                className="bg-[oklch(0.13_0_0)] border-white/12 text-white placeholder:text-white/30 resize-none font-mono text-xs"
              />
            </div>
            <Button
              onClick={handleFork}
              disabled={submitting || !title}
              className="w-full bg-white text-black hover:bg-white/90"
            >
              {submitting ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
