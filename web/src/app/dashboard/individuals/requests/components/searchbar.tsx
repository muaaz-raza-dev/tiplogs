import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useFetchSelfRegistrationRequests } from '@/hooks/query/useIndividualQ'
import { invidualRegistrationRequestsListingAtom } from '@/lib/atoms/indiviudals.atom'
import { Input } from '@/shadcn/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select'
import { useAtom } from 'jotai'
import { Filter, Search } from 'lucide-react'
import React from 'react'
import { useDebouncedCallback } from 'use-debounce'

function Searchbar() {
  const [state,setState] = useAtom(invidualRegistrationRequestsListingAtom)
  const {isPending,mutate}  = useFetchSelfRegistrationRequests()
  const debouced = useDebouncedCallback((value)=>{
    setState({...state,count:0,filters:{...state.filters,q:value}})
    mutate({count:0,status:state.filters.status,q:value})
  },500)
  function onStatusChange(status:"pending"|"all"|"rejected"){
    setState({...state,count:0,filters:{...state.filters,status}})
    mutate({count:0,status,q:state.filters.q})
  }
  return (
    <div className="flex gap-4 justify-between items-center w-full">

     <div className="relative w-full">
                <Input
                  type="text"
                  onChange={({target:{value}})=>debouced(value)}
                  placeholder="Search requests by name, email, or status..."
                  className="pl-10 pr-4 py-2 w-full"
                  aria-label="Search student registration requests"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    {isPending &&
                <div className="absolute right-3 top-1/2 -translate-y-1/2 ">
                <ServerRequestLoader/>
                </div>
    }
              </div>
            <Select value={state.filters.status} onValueChange={onStatusChange}  disabled={isPending}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 " />
                  <SelectValue placeholder="Select Status " />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={"all"}  >All</SelectItem>
                    <SelectItem value={"pending"}  >Pending</SelectItem>
                    <SelectItem value={"rejected"}  >Rejected</SelectItem>
                </SelectContent>
              </Select>

                  </div>
  )
}

export default Searchbar