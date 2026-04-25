export const siteConfig = {
  name: "Jejaku",
  url: "https://jejaku.my",
  ogImage: "https://jejaku.my/og.jpg",
  description:
    "Jejaku.my gives your business a real-time view of every item you own across every location\nso you never lose stock, miss a reorder, or waste time counting manually again.",
  links: {
    twitter: "https://twitter.com/jejaku",
    github: "https://github.com/KauTryKauCuba/jejaku.my",
  },
  mainNav: [
    { name: 'Features', href: '/features' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ],
}

export type SiteConfig = typeof siteConfig
