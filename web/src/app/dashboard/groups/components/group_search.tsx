"use client"
import ServerRequestLoader from "@/components/loaders/server-request-loader"
import { useGetGroups } from "@/hooks/query/useGroupQ"
import { GroupsListingAtom } from "@/lib/atoms/groups.atom"
import { Card, CardContent } from "@/shadcn/components/ui/card"
import { Input } from "@/shadcn/components/ui/input"
import { useAtom } from "jotai"
import {  Search } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"


function GroupSearch() {
    const {mutate ,isPending} = useGetGroups()
    const [state,setState] = useAtom(GroupsListingAtom)
    const setValue = useDebouncedCallback((val:string)=>{
            mutate({count:0,input:val})
    },500)
    
  return (
    <Card className="mb-6 w-full">
            <CardContent>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input value={state.filters.input}  onChange={(e)=>{setValue(e.target.value);setState({...state,filters:{...state.filters,input:e.target.value}})}} placeholder="Search classes..." className="pl-10" />
            {
              isPending ?
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" >
            <ServerRequestLoader/>
            </div>
             :null
            }
          </div>
            </CardContent>
        </Card>
  )
}

export default GroupSearch