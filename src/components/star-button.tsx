"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export function StarButton({
  submissionId,
  initialCount,
  initialStarred,
}: {
  submissionId: string
  initialCount: number
  initialStarred: boolean
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [count, setCount] = useState(initialCount)
  const [starred, setStarred] = useState(initialStarred)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    if (!session) {
      router.push("/login")
      return
    }
    setLoading(true)
    const res = await fetch(`/api/submissions/${submissionId}/star`, {
      method: "POST",
    })
    const data = await res.json()
    setStarred(data.starred)
    setCount(data.count)
    setLoading(false)
  }

  return (
    <Button
      onClick={toggle}
      disabled={loading}
      variant="outline"
      className={`gap-2 border-white/15 bg-transparent text-sm font-medium transition-all ${
        starred
          ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/8"
          : "text-white/60 hover:text-white hover:border-white/30"
      }`}
    >
      <Star className={`h-4 w-4 ${starred ? "fill-yellow-400" : ""}`} />
      {count} {count === 1 ? "Star" : "Stars"}
    </Button>
  )
}
