import Link from "next/link"
import { Bell, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardHeaderProps {
  userName: string
  userRole: string
}

export default function DashboardHeader({ userName, userRole }: DashboardHeaderProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 px-4 md:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          Treadify
        </span>
      </Link>
      <nav className="hidden flex-1 md:flex">
        <Link
          href="/dashboard"
          className="flex h-full items-center px-4 text-sm font-medium text-slate-400 transition-colors hover:text-indigo-400"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/channels"
          className="flex h-full items-center px-4 text-sm font-medium text-slate-400 transition-colors hover:text-indigo-400"
        >
          Channels
        </Link>
        <Link
          href="/dashboard/goals"
          className="flex h-full items-center px-4 text-sm font-medium text-slate-400 transition-colors hover:text-indigo-400"
        >
          Goals
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-slate-700">
                <AvatarImage src="/placeholder.svg" alt={userName} />
                <AvatarFallback className="text-sm bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-slate-800 bg-slate-900/90 backdrop-blur-sm text-slate-300">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">{userName}</p>
                <p className="text-xs leading-none text-slate-400">{userRole}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="hover:bg-slate-800 hover:text-indigo-400 cursor-pointer">
              <Link href="/dashboard/profile" className="flex items-center w-full">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-800 hover:text-indigo-400 cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="hover:bg-slate-800 hover:text-indigo-400 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
