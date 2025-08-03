import { Input } from '@/shadcn/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'

function Searchbar() {
  return (
     <div className="relative">
                <Input
                  type="text"
                  placeholder="Search requests by name, email, or status..."
                  className="pl-10 pr-4 py-2 w-full"
                  aria-label="Search student registration requests"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
  )
}

export default Searchbar