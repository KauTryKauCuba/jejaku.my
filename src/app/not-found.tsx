import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/SiteLogo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center">
        <Link href="/" className="mb-8">
          <Logo className="h-10 w-auto" />
        </Link>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
          404 Error
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base font-normal leading-7 text-muted-foreground">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/">
              Go back home
            </Link>
          </Button>
          <Link href="/about" className="text-sm font-semibold text-foreground hover:underline">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
