import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[40rem] h-[40rem] rounded-full bg-purple-600/30 blur-3xl opacity-20"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-blue-600/30 blur-3xl opacity-20"></div>
        <div className="absolute top-[60%] left-[40%] w-[30rem] h-[30rem] rounded-full bg-cyan-600/30 blur-3xl opacity-20"></div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-6 max-w-md">
          <div className="relative">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              404
            </h1>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl"></div>
          </div>

          <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>

          <p className="text-slate-400">
            The page you're looking for doesn't exist or has been moved. Check the URL or return to the dashboard.
          </p>

          <div className="pt-6">
            <Link href="/">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 px-6 py-6">
                <Home className="mr-2 h-5 w-5" />
                Return to Dashboard
              </Button>
            </Link>
          </div>

          <div className="pt-8">
            <div className="inline-block relative">
              <div className="text-xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                &lt;/&gt;
              </div>
              <div className="absolute inset-0 blur-sm bg-gradient-to-r from-cyan-400/30 to-blue-400/30 opacity-50"></div>
            </div>
            <p className="text-sm text-slate-500 mt-2">Treadify</p>
          </div>
        </div>
      </main>
    </div>
  )
}
