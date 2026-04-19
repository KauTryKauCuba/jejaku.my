import Link from 'next/link'
import { Logo } from '@/components/ui/SiteLogo'
import { Code2, MessageCircle, Globe, Mail } from 'lucide-react'

const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/features' },
      { name: 'Solutions', href: '/solutions' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Updates', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>
            <p className="text-sm leading-6 text-muted-foreground max-w-xs">
              Modern solutions for customer engagement. Highly customizable components for building modern websites.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <Code2 className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  {footerLinks[0].title}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks[0].links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  {footerLinks[1].title}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks[1].links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  {footerLinks[2].title}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks[2].links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-muted-foreground hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 sm:mt-16 lg:mt-20">
          <p className="text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} Jejaku.my. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
