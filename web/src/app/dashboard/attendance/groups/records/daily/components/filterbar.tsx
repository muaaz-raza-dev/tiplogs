import React, { useEffect } from 'react'
import { Card, CardContent } from "@/shadcn/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select"
import { useAtom } from 'jotai'
import {AttOverviewDailyFiltersAtom } from '@/lib/atoms/att-details-group-module.atom'
import { useGetModuleGroupPairs } from '@/hooks/query/useAttQ'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/shadcn/components/ui/button'
import moment from 'moment'

function Filterbar() {
    const pathname = usePathname()
    const {data} = useGetModuleGroupPairs()
    const params = useSearchParams()
    const [filters,setFilters] = useAtom(AttOverviewDailyFiltersAtom)


    const modules = data?.payload.modules.filter(e=>e.frequency==(pathname.includes("daily")?"daily":"custom"))
    const groups = data?.payload.groups 

    useEffect(() => {
    const module = params.get("module")
    const group = params.get("group")
    if (module && group){
        setFilters({group:group,module:module,start_date:moment().format("YYYY-MM-DD")})
    }
    }, [])

  return (
      <Card>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="w-full">

                <label className="text-sm font-medium mb-2 block text-muted-foreground">Attedance Module</label>
                <Select value={filters.module} onValueChange={(e)=>setFilters({...filters,module:e})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules?.map((module) => (
                      <SelectItem key={module.id} value={module.id}>
                        <span >{module.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full">

                <label className="text-sm font-medium text-muted-foreground mb-2 block">Group</label>
                <Select value={filters.group} onValueChange={(e)=>setFilters({...filters,group:e})} >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups?.[filters.module]?.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <span>{group.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                
                <Button variant="outline">
                  Clear Filters
                </Button>
            </div>
          </CardContent>
        </Card>
  )
}

export default Filterbar