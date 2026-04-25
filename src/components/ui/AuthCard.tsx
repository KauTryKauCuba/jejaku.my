"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: React.ReactNode
  className?: string
  title: string
  description?: string
}

export function AuthCard({ children, className, title, description }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "w-full max-w-[400px] mx-auto p-6 rounded-2xl border bg-background/50 backdrop-blur-xl relative overflow-hidden",
        className
      )}
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {children}
    </motion.div>
  )
}
