"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LogOut, UserRoundPenIcon, LayoutDashboard, Puzzle, ClipboardCheck, GitBranch, Target, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
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
    username: string
    userName: string
    userRole: string
}

export default function DashboardHeader({ username, userName, userRole }: DashboardHeaderProps) {
    if (!userName || !userRole) return null
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()

    const router = useRouter()
    const pathname = usePathname()

    const handelLogout = async () => {
        try {
            const res = await fetch("http://localhost:5000/auth/logout", {
                method: "POST",
                headers: { Accept: "application/json" },
                credentials: "include",
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(<div className="select-none">Logout failed. Please try again.</div>)
                return
            }

            if (data.message === "Logout successful") {
                router.push("/")
                toast.success(<div className="select-none">Logout successful</div>)
            } else {
                toast.error("Logout failed. Please try again.")
            }
        }
        catch (error) {
            console.error("Error logging out:", error)
            toast("Logout failed. Please try again.")
        }
    }

    const getNavLinks = () => {
        const links = [
            {
                name: "Dashboard",
                href: `/${username}`,
                icon: <LayoutDashboard className="mr-1 h-4 w-4" />,
                roles: ["Developer", "Technical Lead", "Product Manager"],
            },
            {
                name: "Features",
                href: `/${username}/features`,
                icon: <Puzzle className="mr-1 h-4 w-4" />,
                roles: ["Product Manager"],
            },
            {
                name: "Commits",
                href: `/${username}/commits`,
                icon: <GitBranch className="mr-1 h-4 w-4" />,
                roles: ["Developer"],
            },
            {
                name: "Reviews",
                href: `/${username}/review`,
                icon: <ClipboardCheck className="mr-1 h-4 w-4" />,
                roles: ["Technical Lead"],
            },
            {
                name: "Goals",
                href: `/${username}/goals`,
                icon: <Target className="mr-1 h-4 w-4" />,
                roles: ["Technical Lead", "Developer"],
            },
            {
                name: "Reports",
                href: `/${username}/report`,
                icon: <BarChart className="mr-1 h-4 w-4" />,
                roles: ["Product Manager"],
            },
            {
                name: "Profile",
                href: `/${username}/profile`,
                icon: <UserRoundPenIcon className="mr-1 h-4 w-4" />,
                roles: ["Technical Lead", "Product Manager", "Developer"],
            }
        ]
        return links.filter((link) => link.roles.includes(userRole))
    }

    const navlinks = getNavLinks()

    return (
        <header className="sticky top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 px-4 md:px-6 select-none">

            <div className="flex items-center gap-2 font-semibold mr-2">
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                    Treadify
                </span>
            </div>

            <div className="flex items-center space-x-4">
                {navlinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={index}
                            href={link.href}
                            className="group flex items-center gap-1 font-semibold"
                        >
                            <span
                                className={`text-sm flex items-center transition-colors duration-200 ${isActive
                                        ? "text-cyan-400 font-medium"
                                        : "text-cyan-700 hover:text-cyan-400 font-light"
                                    }`}
                            >
                                <span
                                    className={`mr-1 transform transition-transform duration-200 ${isActive ? "scale-125" : "group-hover:scale-125"
                                        }`}
                                >
                                    {link.icon}
                                </span>
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div className="ml-auto flex items-center gap-4">
                <p className="text-xs leading-none text-slate-400 select-none">{userRole}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8 border border-slate-700">
                                <AvatarImage src="/placeholder.svg" alt={userName} />
                                <AvatarFallback className="text-sm bg-gradient-to-br from-cyan-400 to-purple-600 text-white select-none">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-slate-800 bg-slate-900/90 backdrop-blur-sm text-slate-300">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-md px-4 py-2 text-cyan-400 font-medium leading-none select-none">{userName}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem className="hover:bg-slate-800 hover:text-indigo-400 cursor-pointer">
                            <Link href={`/${username}/profile`} className="flex items-center w-full">
                                <UserRoundPenIcon className="mr-2 h-4 w-4 text-cyan-600" />
                                <span className="tracking-tight">Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem className="hover:bg-slate-800 hover:text-indigo-400 cursor-pointer">
                            <Link href="" onClick={handelLogout} className="flex items-center w-full">
                                <LogOut className="mr-2 h-4 w-4 text-cyan-600" />
                                <span className="tracking-tight">Log out</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header >
    )
}
