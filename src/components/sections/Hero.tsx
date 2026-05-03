'use client';

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  MessageSquare,
  Shield,
  Zap,
  Globe,
  Layers,
  MousePointer2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

const featureIcons = [
  { name: 'Advanced Analytics', Icon: BarChart3, color: 'bg-blue-500', pos: '-translate-x-24 md:-translate-x-[680px] -translate-y-12 md:-translate-y-[400px] rotate-[-12deg]', tx: -680, ty: -400 },
  { name: 'Smart Messaging', Icon: MessageSquare, color: 'bg-emerald-500', pos: 'translate-x-24 md:translate-x-[680px] -translate-y-12 md:-translate-y-[400px] rotate-[12deg]', tx: 680, ty: -400 },
  { name: 'Enterprise Security', Icon: Shield, color: 'bg-indigo-500', pos: '-translate-x-32 md:-translate-x-[750px] translate-y-4 md:-translate-y-[180px] rotate-[-8deg]', tx: -750, ty: -180 },
  { name: 'Blazing Fast Speed', Icon: Zap, color: 'bg-amber-500', pos: 'translate-x-32 md:translate-x-[750px] translate-y-4 md:-translate-y-[180px] rotate-[8deg]', tx: 750, ty: -180 },
  { name: 'Global Deployment', Icon: Globe, color: 'bg-orange-500', pos: '-translate-x-16 md:-translate-x-[660px] translate-y-16 md:translate-y-0 rotate-[-15deg]', tx: -660, ty: 0 },
  { name: 'Modular Layers', Icon: Layers, color: 'bg-rose-500', pos: 'translate-x-16 md:translate-x-[660px] translate-y-16 md:translate-y-0 rotate-[15deg]', tx: 660, ty: 0 },
];

export const Hero = () => {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, z: 0 });
  const [activeText, setActiveText] = useState('');
  const [targetIndex, setTargetIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const animate = async () => {
      while (isMounted) {
        const feature = featureIcons[targetIndex];

        // 1. Move behind to the target
        setCursorPos(prev => ({ ...prev, z: 0 }));
        await new Promise(r => setTimeout(r, 100)); // Small delay for z-index switch
        setCursorPos(prev => ({ ...prev, x: feature.tx, y: feature.ty }));

        // Wait for half movement then bring to top before arrival
        await new Promise(r => setTimeout(r, 600));
        setCursorPos(prev => ({ ...prev, z: 20 }));

        // Wait for the rest of the movement
        await new Promise(r => setTimeout(r, 600));

        // 2. Already on top now, wait 0.5s before typing
        await new Promise(r => setTimeout(r, 500));

        // 4. Typing effect
        for (let i = 0; i <= feature.name.length; i++) {
          if (!isMounted) return;
          setActiveText(feature.name.slice(0, i));
          await new Promise(r => setTimeout(r, 50));
        }

        // 5. Wait to read
        await new Promise(r => setTimeout(r, 2000));

        // 6. Clear and next
        setActiveText('');
        setTargetIndex((prev) => (prev + 1) % featureIcons.length);
      }
    };

    animate();
    return () => { isMounted = false; };
  }, [targetIndex]);

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
            <Button asChild size="lg" className="rounded-xl px-5 text-base font-normal">
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
          <p className="mt-4 text-xs text-muted-foreground font-medium flex items-center justify-center gap-1.5">
            "This inventory management system is yours to use completely free, forever."
          </p>
        </div>

        <div className="relative mt-12 md:mt-20 flex justify-center px-4 min-h-[400px] md:min-h-[600px]">
          {/* Animated Cursor */}
          <div
            className="absolute flex items-start gap-2 pointer-events-none transition-all duration-1000 ease-in-out"
            style={{
              transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
              zIndex: cursorPos.z,
              left: '50%',
              top: '50%',
              marginTop: '-12px',
              marginLeft: '-4px'
            }}
          >
            <MousePointer2 className="size-5 text-foreground fill-foreground shadow-xl" />
            {activeText && (
              <div className="bg-background/95 backdrop-blur-sm border border-primary/20 px-3 py-1.5 rounded-lg shadow-2xl animate-in fade-in zoom-in duration-300">
                <p className="text-xs font-bold text-primary tracking-tight whitespace-nowrap">
                  {activeText}
                  <span className="inline-block w-0.5 h-3 ml-0.5 bg-primary animate-pulse align-middle" />
                </p>
              </div>
            )}
          </div>

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
                src="/assets/screens/dark.png"
                alt="app screen dark mode"
                width={2700}
                height={1440}
                priority
              />
              <Image
                className="z-2 border-border/25 aspect-[15/8] relative rounded-2xl border dark:hidden"
                src="/assets/screens/light.png"
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
