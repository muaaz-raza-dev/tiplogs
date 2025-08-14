import React from 'react'
import { AppSidebar } from './components/sidebar'
import { SidebarProvider } from '@/shadcn/components/ui/sidebar'

function layout({children}: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
            <AppSidebar/>
    <main className='w-full'>
            {children}
    </main>

    </SidebarProvider>
  )
}

export default layout