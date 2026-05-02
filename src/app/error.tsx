'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/SiteLogo'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center">
        <Link href="/" className="mb-8">
          <Logo className="h-10 w-auto" />
        </Link>
        <span className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive ring-1 ring-inset ring-destructive/20">
          Error
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Something went wrong!
        </h1>
        <p className="mt-6 text-base font-normal leading-7 text-muted-foreground max-w-md">
          An unexpected error has occurred. We have been notified and are working to fix it.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button
            onClick={() => reset()}
            size="lg"
            className="rounded-xl"
          >
            Try again
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl">
            <Link href="/">
              Go back home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
