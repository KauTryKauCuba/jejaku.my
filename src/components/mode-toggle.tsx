'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/Button';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm transition-none"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <div className="relative size-full flex items-center justify-center">
        <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" />
        <Moon className="hidden h-[1.2rem] w-[1.2rem] dark:block" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
