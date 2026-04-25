import * as React from "react"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: React.ReactNode
  className?: string
  title: string
  description?: string
}

export function AuthCard({ children, className, title, description }: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[380px] mx-auto p-5 rounded-2xl border bg-background/50 backdrop-blur-xl relative overflow-hidden",
        className
      )}
    >
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {children}
    </div>
  )
}
