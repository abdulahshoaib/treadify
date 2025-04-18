"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function ConnectGitHub() {
  const router = useRouter();

  useEffect(() => {
    // Optional: if already connected, auto-redirect to dashboard
    const checkGitHubConnection = async () => {
      const res = await fetch("http://localhost:5000/auth/github/status", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.connected && data.role) {
        router.push(`/dashboard/${data.role}`);
      }
    };

    checkGitHubConnection();
  }, [router]);

  const handleGitHubConnect = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-sm p-8 rounded-xl shadow-xl space-y-6 text-center">
        <h2 className="text-2xl font-bold text-white">Connect your GitHub</h2>
        <p className="text-slate-400">
          GitHub integration is required to continue. Please authorize your GitHub account.
        </p>
        <Button
          onClick={handleGitHubConnect}
          className="w-full h-12 bg-gradient-to-r from-gray-800 to-slate-700 hover:from-gray-700 hover:to-slate-600 text-white font-medium rounded-lg"
        >
          <Github className="mr-2 h-5 w-5" />
          Connect GitHub
        </Button>
      </div>
    </div>
  );
}

