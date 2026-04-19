import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function SolutionsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">Solutions</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mb-10">
        Tailored solutions for your business needs. Scaling engagement across every channel.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  )
}
