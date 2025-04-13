import Link from "next/link"
import { CalendarClock, CheckCircle2, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ChannelCardProps {
  id: string
  name: string
  type: "product" | "feature"
  deadline: string
  progress: number
  members: number
  href: string
}

export default function ChannelCard({ id, name, type, deadline, progress, members, href }: ChannelCardProps) {
  return (
    <Card className="overflow-hidden border-slate-800/50 bg-slate-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:border-slate-700/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 text-lg font-semibold text-white">{name}</CardTitle>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
              type === "product" ? "bg-indigo-500/20 text-indigo-300" : "bg-purple-500/20 text-purple-300"
            }`}
          >
            {type}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-slate-400">
            <CalendarClock className="mr-1 h-4 w-4 text-cyan-400" />
            <span>Deadline: {deadline}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-white font-medium">{progress}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4 text-indigo-400" />
              <span>{members} members</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className={`mr-1 h-4 w-4 ${progress === 100 ? "text-green-400" : "text-slate-400"}`} />
              <span>{progress === 100 ? "Completed" : "In progress"}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <button className="w-full rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors">
            View Channel
          </button>
        </Link>
      </CardFooter>
    </Card>
  )
}
