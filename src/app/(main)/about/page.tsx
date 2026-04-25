import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">About Us</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-10">
        We are a team of designers and engineers passionate about creating the best customer engagement tools.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
