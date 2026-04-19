import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Features</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-10">
        Discover the powerful capabilities of Jejaku. We're building the future of customer engagement.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
