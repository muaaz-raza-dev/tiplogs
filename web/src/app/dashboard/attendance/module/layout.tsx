import { Button } from '@/shadcn/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
 
function layout({children}: { children: React.ReactNode }) {
   return (
    <div className="w-full mx-auto p-6 space-y-6">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Modules</h1>
          <p className="text-muted-foreground">Manage and view all attendance modules in your organization</p>
        </div>
        <div className="flex items-center gap-3">
        <Link href="/dashboard/attendance/module/new">

        <Button >
          <Plus className="w-4 h-4 " />
          Create Attendance Module
        </Button>

        </Link>
        </div>

      </div>
      {children}
      </div>
   )
 }
 
 export default layout
 