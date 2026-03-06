"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") ?? "/admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Invalid password");
      }

      router.push(redirect);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-sage-200/60 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Checking..." : "Log in"}
          </Button>
        </form>
        <p className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
