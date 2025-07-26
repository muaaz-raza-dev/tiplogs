import React from 'react'
import { Card, CardContent } from "@/shadcn/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu"

import { Button } from "@/shadcn/components/ui/button"
import { Input } from "@/shadcn/components/ui/input"
import { Search, Filter } from "lucide-react"
import { useAtom } from 'jotai'
import { UsersListingAtom } from '@/lib/atoms/users.atom'
import {useDebouncedCallback} from "use-debounce"
import { useFetchAllUsers } from '@/hooks/query/useUserQ'
import ServerRequestLoader from '@/components/loaders/server-request-loader'

function UsersFilterBar() {
    const [state ,setState]= useAtom(UsersListingAtom)
    const {mutate,isPending} = useFetchAllUsers()
      const debounced = useDebouncedCallback(
    (value) => {
        setState({...state,filters:{...state.filters,input:value},count:0,users:{}})
        mutate({count:0,...state.filters,input:value})
    },
    1000
  );
  function handleFiltersChange(type:"role"|"status",value:string){
     setState({...state,filters:{...state.filters,[type]:value},count:0,users:{}})
     mutate({count:0,...state.filters,[type]:value})
  }
  
  return (
     <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search users by name or username ..." className="pl-10"  onChange={(e)=>debounced(e.target.value)}/>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4">
              {isPending? <ServerRequestLoader/> :null  }
            </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Role Filter */}
              <DropdownMenu >
                <DropdownMenuTrigger asChild >
                  <Button variant="outline" className="justify-between min-w-[80px] hover:text-white">
                    <Filter className="w-4 h-4 " />
                    Role: {state.filters.role}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end"  >
                  <DropdownMenuRadioGroup value={state.filters.role} onValueChange={(value) => handleFiltersChange("role",value)}>
                    <DropdownMenuRadioItem value="all">All </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="user">User</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="manager">Manager</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between min-w-[120px] hover:text-white">
                    <Filter className="w-4 h-4 " />
                    Status : {state.filters.status}
                    
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup   value={state.filters.status} onValueChange={(value) => handleFiltersChange("status",value)} >
                    <DropdownMenuRadioItem value="all">All Status</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="blocked">Blocked</DropdownMenuRadioItem>

                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-2 text-sm text-muted-foreground">
            Total results : {state.total}
          </div>
        </CardContent>
      </Card>
  )
}

export default UsersFilterBar