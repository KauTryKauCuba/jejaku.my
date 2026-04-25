import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { siteConfig } from '@/lib/site-config'

export const Hero = () => {
  return (
    <section className="pb-24 md:pb-32">
      <div className="relative pt-20 md:pt-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
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
        </div>

        <div className="relative -mr-56 mt-6 overflow-hidden px-2 sm:mr-0 sm:mt-8 md:mt-12">
          <div className="ring-background bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 ring-1">
            <Image
              className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
              src="/assets/screens/mail2.png"
              alt="app screen dark mode"
              width={2700}
              height={1440}
              priority
            />
            <Image
              className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
              src="/assets/screens/mail2-light.png"
              alt="app screen light mode"
              width={2700}
              height={1440}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
