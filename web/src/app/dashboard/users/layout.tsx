 import { Button } from '@/shadcn/components/ui/button'
import { Bell, UserPlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
 
 function layout({children}: { children: React.ReactNode }) {
   return (
    <div className="w-full mx-auto p-6 space-y-6">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage and view all users in your organization</p>
        </div>
        <div className="flex items-center gap-3">
        <Link href="/dashboard/users/new">

        <Button >
          <UserPlus className="w-4 h-4 " />
          Add User
        </Button>
        </Link>
        <Link href="/dashboard/users/requests" className="relative">
        <Button>
              <span className="absolute top-0 right-0 -mt-1 -mr-1 h-3 w-3 rounded-full bg-destructive " />
            <Bell  className="w-4 h-4 "/>
            User Requests
        </Button>
        </Link>

        </div>

      </div>
      {children}
      </div>
   )
 }
 
 export default layout
 