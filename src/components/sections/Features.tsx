
'use client';

import React from 'react';
import { 
  Package, 
  Barcode, 
  MapPin, 
  Bell, 
  BarChart3, 
  ShieldCheck,
  Smartphone,
  Layers,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Hybrid Inventory',
    description: 'Track high-volume bulk items and high-value serialized units in one unified system. Perfect for any business type.',
    icon: Layers,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  },
  {
    title: 'Serial Number Tracking',
    description: 'Assign unique identities to every item. Monitor warranty status, history, and physical location for every individual unit.',
    icon: Barcode,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'Multi-Location Support',
    description: 'Manage stock across multiple warehouses, stores, or storage units. Transfer items between locations seamlessly.',
    icon: MapPin,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10'
  },
  {
    title: 'Low Stock Intelligence',
    description: 'Never run out of best-sellers. Get instant notifications when stock levels fall below your custom minimum thresholds.',
    icon: Bell,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'Visual Reporting',
    description: 'Make data-driven decisions with beautiful, easy-to-read reports on sales trends, stock value, and turnover rates.',
    icon: BarChart3,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10'
  },
  {
    title: 'QR & Barcode Scanning',
    description: 'Speed up stock-ins and audits. Use your mobile device as a professional scanner to update inventory on the fly.',
    icon: Smartphone,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10'
  }
];

export const Features = () => {
  return (
    <section id="features" className="pt-24 md:pt-32 pb-24 md:pb-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Everything you need to <span className="text-primary">scale</span> your operations
          </h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-balance">
            Designed for modern teams who want to move fast without the complexity of traditional enterprise software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-3xl border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className={cn(
                "size-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110",
                feature.bg,
                feature.color
              )}>
                <feature.icon className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Bottom indicator or link */}
        <div className="mt-16 md:mt-24 flex justify-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30">
            <span>And much more built-in tools</span>
            <div className="w-px h-4 bg-border/50 mx-2" />
            <a href="/features" className="text-primary font-bold hover:underline flex items-center gap-1">
              View All Features
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
