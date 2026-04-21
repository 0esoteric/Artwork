import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login | Artisan Gallery",
  description: "Sign in to your Artisan Gallery account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background px-4 py-12">
      <Suspense fallback={<div className="animate-pulse h-96 w-full max-w-md bg-card rounded-xl" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
