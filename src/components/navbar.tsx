"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Layers } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-[oklch(0.08_0_0)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-white" />
          <span className="font-semibold tracking-tight text-white">
            OpenStack
          </span>
          <span className="text-xs text-white/40">by Rocketship</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Explore
          </Link>

          {session ? (
            <>
              <Link href="/submit">
                <Button size="sm" variant="outline" className="border-white/20 bg-transparent hover:bg-white/8 text-white text-xs">
                  + Submit
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 cursor-pointer rounded-full ring-1 ring-white/20 hover:ring-white/40 transition-all focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image ?? ""} />
                    <AvatarFallback className="bg-white/10 text-xs">
                      {session.user?.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[oklch(0.11_0_0)] border-white/10">
                  <DropdownMenuItem onClick={() => window.location.href = `/profile/${session.user?.id}`} className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = "/dashboard"} className="cursor-pointer">
                    My Submissions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-red-400"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-white text-black hover:bg-white/90 text-xs font-medium">
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
