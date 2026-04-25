"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
  tabs: {
    id: string
    label: string
    href: string
    active: boolean
  }[]
  className?: string
}

export function Tabs({ tabs, className }: TabsProps) {
  return (
    <div className={cn("flex p-1 bg-muted/50 rounded-xl mb-6", className)}>
      {tabs.map((tab) => (
        <a
          key={tab.id}
          href={tab.href}
          className={cn(
            "flex-1 text-center py-2 text-sm font-medium rounded-lg transition-all",
            tab.active 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </a>
      ))}
    </div>
  )
}
