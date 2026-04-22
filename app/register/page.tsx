import { Suspense } from "react"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Create Account | VELURA",
  description: "Create your VELURA account to start shopping",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background px-4 py-12">
      <Suspense fallback={<div className="animate-pulse h-96 w-full max-w-md bg-card rounded-xl" />}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
