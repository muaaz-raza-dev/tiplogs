import React from 'react'
import { AppSidebar } from './sidebar'
import { SidebarProvider, SidebarTrigger } from '@/shadcn/components/ui/sidebar'

function layout({children}: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
            <AppSidebar/>
    <main>
        <SidebarTrigger/>
            {children}
    </main>

    </SidebarProvider>
  )
}

export default layout