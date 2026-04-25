export const siteConfig = {
  name: "Jejaku",
  url: "https://jejaku.my",
  ogImage: "https://jejaku.my/og.jpg",
  description:
    "Highly customizable components for building modern websites and applications that look and feel the way you mean it.",
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
