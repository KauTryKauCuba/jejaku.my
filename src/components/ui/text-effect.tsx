'use client';

import { cn } from '@/lib/utils';
import React from 'react';

type TextEffectProps = {
  children: string;
  per?: 'word' | 'char' | 'line';
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  segmentWrapperClassName?: string;
};

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  className,
  segmentWrapperClassName,
}: TextEffectProps) {
  let segments: string[];

  if (per === 'line') {
    segments = children.split('\n');
  } else if (per === 'word') {
    segments = children.split(/(\s+)/);
  } else {
    segments = children.split('');
  }

  const Tag = as as any;

  return (
    <Tag className={cn('whitespace-pre-wrap', className)}>
      {segments.map((segment, index) => {
        const content = per === 'char' ? segment : segment;
        return (
          <span
            key={`${per}-${index}-${segment}`}
            className={cn(
              per === 'line' ? 'block' : 'inline-block',
              segmentWrapperClassName
            )}
          >
            {content}
          </span>
        );
      })}
    </Tag>
  );
}
