import Link from "next/link"
import { CalendarClock, CheckCircle2, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1 text-lg font-semibold">{name}</CardTitle>
          <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium capitalize">{type}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarClock className="mr-1 h-4 w-4" />
            <span>Deadline: {deadline}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{members} members</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="mr-1 h-4 w-4" />
              <span>{progress === 100 ? "Completed" : "In progress"}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            View Channel
          </button>
        </Link>
      </CardFooter>
    </Card>
  )
}
