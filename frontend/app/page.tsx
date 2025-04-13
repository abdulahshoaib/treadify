import Link from "next/link"
import { ArrowRight, CheckCircle, Clock, GitBranch, Target, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-950 text-white">
            {/* Background gradient effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[15%] w-[40rem] h-[40rem] rounded-full bg-purple-600/20 blur-3xl opacity-20"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-blue-600/20 blur-3xl opacity-20"></div>
                <div className="absolute top-[60%] left-[40%] w-[30rem] h-[30rem] rounded-full bg-cyan-600/20 blur-3xl opacity-20"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 px-4 lg:px-6 h-16 flex items-center border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80">
                <Link href="/" className="flex items-center justify-center">
                    <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                        Treadify
                    </span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link href="/features" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
                        Features
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
                        Pricing
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors">
                        About
                    </Link>
                </nav>
                <div className="ml-4 flex items-center gap-2">
                    <Link href="/login">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-700 text-indigo-400 hover:text-indigo-600 hover:border-indigo-400"
                        >
                            Log In
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0"
                        >
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 flex-1">
                {/* Hero section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                                        Streamline Your Product Development
                                    </h1>
                                    <p className="max-w-[600px] text-slate-400 md:text-xl">
                                        Treadify helps teams collaborate effectively with structured channels, clear goals, and seamless
                                        GitHub integration.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link href="/signup">
                                        <Button className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0">
                                            Get Started
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="rounded-xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm p-8 shadow-lg">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-indigo-500/20 p-2 rounded-lg">
                                                <Target className="h-5 w-5 text-indigo-400" />
                                            </div>
                                            <h3 className="font-medium text-white">Clear Goals</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-purple-500/20 p-2 rounded-lg">
                                                <Clock className="h-5 w-5 text-purple-400" />
                                            </div>
                                            <h3 className="font-medium text-white">Deadline Management</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-cyan-500/20 p-2 rounded-lg">
                                                <CheckCircle className="h-5 w-5 text-cyan-400" />
                                            </div>
                                            <h3 className="font-medium text-white">Progress Tracking</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-indigo-500/20 p-2 rounded-lg">
                                                <GitBranch className="h-5 w-5 text-indigo-400" />
                                            </div>
                                            <h3 className="font-medium text-white">GitHub Integration</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-purple-500/20 p-2 rounded-lg">
                                                <Users className="h-5 w-5 text-purple-400" />
                                            </div>
                                            <h3 className="font-medium text-white">Team Collaboration</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features section */}
                <section className="w-full py-12 md:py-24 lg:py-32 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950 pointer-events-none"></div>
                    <div className="container relative z-10 px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2 max-w-3xl">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                                    Role-Based Collaboration
                                </h2>
                                <p className="text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Treadify provides tailored experiences for each team member based on their role in the product
                                    development process.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg">
                                    <Users className="h-8 w-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">Product Manager</h3>
                                    <p className="text-slate-400">
                                        Create product channels, set deadlines, and track overall progress across all features.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
                                    <Target className="h-8 w-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">Technical Lead</h3>
                                    <p className="text-slate-400">
                                        Manage feature channels, assign developers, and ensure technical implementation meets requirements.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg">
                                    <GitBranch className="h-8 w-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">Developer</h3>
                                    <p className="text-slate-400">
                                        Complete assigned goals, track personal contributions, and collaborate within feature channels.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="relative z-10 flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-800/50 backdrop-blur-sm bg-slate-950/80">
                <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} Treadify. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link href="/terms" className="text-xs text-slate-500 hover:text-indigo-400">
                        Terms of Service
                    </Link>
                    <Link href="/privacy" className="text-xs text-slate-500 hover:text-indigo-400">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}
