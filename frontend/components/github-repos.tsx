"use client"

import * as React from "react"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

type Repo = {
    name: string
}

type GithubReposProps = {
    repos: Repo[]
    onSelectRepo?: (repoName: string) => void
}

export function GithubRepos({ repos, onSelectRepo }: GithubReposProps) {
    const [selectedRepo, setSelectedRepo] = React.useState<string | null>(null)

    const handleSelect = (repoName: string) => {
        toast(repoName)
        setSelectedRepo(repoName)
        if (onSelectRepo) {
            toast(`Calling onSelectRepo with: ${repoName}`)
            onSelectRepo(repoName)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-800 hover:text-white hover:bg-slate-800/60 bg-slate-900/50 font-light tracking-normal">
                    <Github className="text-cyan-500" absoluteStrokeWidth={true} />
                    {selectedRepo ? selectedRepo : "Select Repository"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full text-left text-white bg-black/90 cursor-pointer scrollbar-thin">
                <DropdownMenuLabel className="text-sm px-2 py-1.5 text-zinc-400">
                    GitHub Repositories
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {repos.length === 0 ? (
                    <DropdownMenuCheckboxItem disabled>
                        No repositories found.
                    </DropdownMenuCheckboxItem>
                ) : (
                    repos.map((repo) => (
                        <DropdownMenuCheckboxItem
                            key={repo.name}
                            checked={repo.name === selectedRepo}
                            onCheckedChange={() => handleSelect(repo.name)}
                            className={`w-auto rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:bg-zinc-800 hover:bg-zinc-800 ${repo.name === selectedRepo ? "bg-zinc-700" : ""
                                }`}
                        >
                            {repo.name}
                        </DropdownMenuCheckboxItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
