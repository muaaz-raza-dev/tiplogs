import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useGetGroupPairs } from '@/hooks/query/useGroupQ'
import { useGetIndividuals } from '@/hooks/query/useIndividualQ'
import { individualListingAtom } from '@/lib/atoms/indiviudals.atom'
import { Input } from '@/shadcn/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select'
import { useAtom } from 'jotai'
import { Filter, Search } from 'lucide-react'
import React, { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

function IndividualFilterbar() {
    const [filters,setFilters] = useState({q:"",group:""})
    const {data,isPending} = useGetGroupPairs()
    const [state,setState] = useAtom(individualListingAtom)
    const {mutate,isPending:isFetching} = useGetIndividuals()
    const debounced = useDebouncedCallback((value:string)=>{
      setState({...state,filters:{...state.filters,q:value},results:{}})
      mutate({count:0,group:filters.group,q:value})
    },500)
    function onGroupChange(group:string){
      setState({...state,filters:{...state.filters,group:group},results:{}})
      setFilters(e=>({...e,group}))
      mutate({count:0,group:group,q:filters.q})
    }
  return (
    <>
    <div className="flex flex-col md:flex-row gap-4 items-center ">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                disabled={isPending}
                type="text"
                onChange={({target:{value}})=>debounced(value)}
                placeholder="Search students by name, or GRNO ..."
                className="pl-10 pr-4 py-2.5 w-full"
                aria-label="Search students"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {/* Role Filter (Grade) */}
              <Select value={filters.group} onValueChange={(e)=>onGroupChange(e)} disabled={isPending||isFetching}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 " />
                  <SelectValue placeholder="Select Group " />
                  {
                    isPending ?  <ServerRequestLoader/> :null 
                }
                </SelectTrigger>
                <SelectContent>
                    {data?.payload.map(e=> (<SelectItem value={e.id}  > {e.name}</SelectItem>))}
                </SelectContent>
              </Select>

     
            </div>
          </div>
          <p className="text-sm text-muted-foreground self-end pt-2 ">Total registered : {state.total}</p>
          </>
          )
}

export default IndividualFilterbar