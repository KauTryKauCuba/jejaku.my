"use client"

import Link from 'next/link'
import { 
  User, 
  Settings, 
  LogOut, 
  UserCircle 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { logoutUser } from '@/app/actions/auth'

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
  }
}

export function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 hover:bg-muted/50 p-1 rounded-full outline-none group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold leading-none mb-1 group-hover:text-primary">{user.name}</p>
            <p className="text-xs text-muted-foreground leading-none">{user.email}</p>
          </div>
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs border border-border/50 group-hover:scale-105">
            {user.name[0]}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-medium leading-none">My Profile</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/profile">
            <DropdownMenuItem className="cursor-pointer">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive cursor-pointer"
          onSelect={async () => {
            await logoutUser();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
