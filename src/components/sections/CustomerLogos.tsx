import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'

export const CustomerLogos = () => {
  return (
    <section className="pb-12 pt-12 md:pb-16">
      <div className="group relative m-auto max-w-5xl px-6">
        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
          <Link
            href="/about"
            className="block text-sm duration-150 hover:opacity-75"
          >
            <span> Meet Our Customers</span>
            <ChevronRight className="ml-1 inline-block size-3" />
          </Link>
        </div>
        <div className="group-hover:blur-xs mx-auto mt-8 grid max-w-2xl grid-cols-4 gap-x-8 gap-y-6 transition-all duration-500 group-hover:opacity-50 sm:gap-x-12 sm:gap-y-10">
          <LogoItem src="/assets/logos/nvidia.svg" alt="Nvidia" />
          <LogoItem src="/assets/logos/column.svg" alt="Column" />
          <LogoItem src="/assets/logos/github.svg" alt="GitHub" />
          <LogoItem src="/assets/logos/nike.svg" alt="Nike" />
          <LogoItem src="/assets/logos/lemonsqueezy.svg" alt="Lemon Squeezy" />
          <LogoItem src="/assets/logos/laravel.svg" alt="Laravel" />
          <LogoItem src="/assets/logos/lilly.svg" alt="Lilly" />
          <LogoItem src="/assets/logos/openai.svg" alt="OpenAI" />
        </div>
      </div>
    </section>
  )
}

const LogoItem = ({ src, alt }: { src: string; alt: string }) => (
  <div className="flex">
    <Image
      className="mx-auto h-5 w-fit dark:invert"
      src={src}
      alt={`${alt} Logo`}
      height={20}
      width={100}
    />
  </div>
)
