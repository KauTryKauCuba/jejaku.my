import React from 'react';
import { siteConfig } from '@/lib/site-config';
import { Zap, LayoutDashboard, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const highlights = [
  {
    title: 'Instant Setup',
    description: 'Get started in minutes, not days. No complex configuration required.',
    icon: Zap,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    title: 'Visual Tracking',
    description: 'See your stock levels at a glance with beautiful, real-time dashboards.',
    icon: LayoutDashboard,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    title: 'One-Click Actions',
    description: 'Update stock, add items, and manage locations with a single click.',
    icon: MousePointer2,
    color: 'text-primary',
    bg: 'bg-primary/10'
  }
];

export const SimplestSolution = () => {
  return (
    <section className="pt-12 md:pt-20 pb-24 md:pb-32 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
            Meet the <span className="text-primary">simplest</span> inventory management solution
          </h2>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-balance">
            {siteConfig.name} gives small teams a simpler, easier way to handle inventory without the headache of spreadsheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-3xl border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className={cn("size-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110", item.bg, item.color)}>
                <item.icon className="size-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
