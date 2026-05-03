import React from 'react'
import { cn } from '@/lib/utils'

export const Logo = ({ className }: { className?: string }) => {
    return (
        <>
            <img
                src="/logo-black.svg"
                alt="Jejaku Logo"
                className={cn('h-7 w-auto dark:hidden block', className)}
            />
            <img
                src="/logo.svg"
                alt="Jejaku Logo"
                className={cn('h-7 w-auto hidden dark:block', className)}
            />
        </>
    )
}


