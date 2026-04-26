'use client';

import React from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  BarChart3, 
  MessageSquare, 
  Shield, 
  Zap, 
  Globe, 
  Layers 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

const featureIcons = [
  { Icon: BarChart3, color: 'bg-blue-500', pos: '-translate-x-24 md:-translate-x-[680px] -translate-y-12 md:-translate-y-[400px] rotate-[-12deg]' },
  { Icon: MessageSquare, color: 'bg-emerald-500', pos: 'translate-x-24 md:translate-x-[680px] -translate-y-12 md:-translate-y-[400px] rotate-[12deg]' },
  { Icon: Shield, color: 'bg-indigo-500', pos: '-translate-x-32 md:-translate-x-[750px] translate-y-4 md:-translate-y-[180px] rotate-[-8deg]' },
  { Icon: Zap, color: 'bg-amber-500', pos: 'translate-x-32 md:translate-x-[750px] translate-y-4 md:-translate-y-[180px] rotate-[8deg]' },
  { Icon: Globe, color: 'bg-orange-500', pos: '-translate-x-16 md:-translate-x-[660px] translate-y-16 md:translate-y-0 rotate-[-15deg]' },
  { Icon: Layers, color: 'bg-rose-500', pos: 'translate-x-16 md:translate-x-[660px] translate-y-16 md:translate-y-0 rotate-[15deg]' },
];

export const Hero = () => {
  return (
    <section className="pb-24 md:pb-32">
      <div className="relative pt-20 md:pt-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Link
            href="/features"
            className="hover:bg-background bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 dark:border-white/10"
          >
            <span className="text-foreground text-sm font-medium">
              Introducing Support for AI Models
            </span>
            <span className="block h-4 w-0.5 bg-border"></span>

            <div className="bg-brand-gradient group-hover:opacity-80 size-6 overflow-hidden rounded-full">
              <div className="flex w-12 -translate-x-1/2 group-hover:translate-x-0">
                <span className="flex size-6">
                  <ArrowRight className="m-auto size-3 text-white" />
                </span>
                <span className="flex size-6">
                  <ArrowRight className="m-auto size-3 text-white" />
                </span>
              </div>
            </div>
          </Link>

          <h1 className="mt-6 max-w-4xl mx-auto text-balance text-5xl font-bold md:text-6xl lg:mt-8 xl:text-[4.5rem]">
            Stop Guessing. <span className="text-primary">Start Knowing.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg">
            {siteConfig.description}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-2 md:flex-row">
            <Button asChild size="lg" className="rounded-xl px-5 text-base">
              <Link href="/register">
                <span className="text-nowrap">Start Building</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-10.5 rounded-xl px-5"
            >
              <Link href="/pricing">
                <span className="text-nowrap">Request a demo</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-12 md:mt-20 flex justify-center px-4">
          {/* Static Feature Icons */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {featureIcons.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "absolute p-2.5 md:p-4 rounded-2xl text-white shadow-2xl z-0",
                  item.color,
                  item.pos
                )}
                style={{ 
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
                }}
              >
                <item.Icon className="size-5 md:size-7" />
              </div>
            ))}
          </div>

          {/* App Screenshot */}
          <div className="relative z-10 w-full max-w-6xl">
            <div className="ring-background bg-background relative overflow-hidden rounded-2xl border p-2 md:p-4 ring-1 shadow-2xl">
              <Image
                className="bg-background aspect-[15/8] relative hidden rounded-2xl dark:block"
                src="/assets/screens/mail2.png"
                alt="app screen dark mode"
                width={2700}
                height={1440}
                priority
              />
              <Image
                className="z-2 border-border/25 aspect-[15/8] relative rounded-2xl border dark:hidden"
                src="/assets/screens/mail2-light.png"
                alt="app screen light mode"
                width={2700}
                height={1440}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
