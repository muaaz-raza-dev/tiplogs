import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/components/ui/avatar"
import { SidebarMenuButton } from '@/shadcn/components/ui/sidebar'
import { useLogOut } from '@/hooks/query/useAuthQ'
import { useAtomValue } from 'jotai'
import { AuthSession } from '@/lib/atoms/auth-session.atom'
import { LogOut } from 'lucide-react'
import ServerRequestLoader from '@/components/loaders/server-request-loader'

function SideBarUserInfo() {
    const {mutate:logout,isPending} = useLogOut()
    const state = useAtomValue(AuthSession)
  return (
        <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={state?.user?.photo || "/placeholder.svg"} alt={"photo"} />
                        <AvatarFallback className="rounded-lg">{state?.user?.full_name.split("")[0]} </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{state?.user?.full_name}</span>
                        <span className="truncate  text-xs tracking-wider">{state?.user?.role}</span>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuItem className="group" onClick={()=>logout()} >
                        {
                            isPending ? <ServerRequestLoader/>  : 
                            <>
                            <LogOut className="group-hover:text-secondary"/>
                      <span> Log out</span>
                            </>
                        }
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
  )
}

export default SideBarUserInfo