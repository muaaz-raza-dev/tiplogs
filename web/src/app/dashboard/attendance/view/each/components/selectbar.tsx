"use client"
import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useFetchEachAttendanceDetailedView, useGetModuleGroupPairs } from '@/hooks/query/useAttQ'
import { AttViewEachFilterAtom } from '@/lib/atoms/att-view-each.atom'
import { Button } from '@/shadcn/components/ui/button'
import { Calendar } from '@/shadcn/components/ui/calendar'
import { Card, CardContent } from '@/shadcn/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover'
import { Select ,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/shadcn/components/ui/select'
import { useAtom } from 'jotai'
import moment from 'moment'
import React from 'react'

function AttendanceViewEachSelectbar() {
  const {data, isPending} = useGetModuleGroupPairs()
  const [state,setState] = useAtom(AttViewEachFilterAtom)
  const {mutate,isPending:isMutatePending}  =useFetchEachAttendanceDetailedView()
  function onSetFilter(){
    if (state.att_date &&state.group && state.module){
      mutate({module:state.module,group:state.group,att_date:state.att_date})
    }
  }

  return (
      <Card>
          <CardContent >
            <div className="flex gap-4 flex-wrap ">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Module</label>
                <Select value={state.module} onValueChange={(val)=>setState({...state,module:val})} disabled={isPending}>
                  <SelectTrigger className='min-w-[250px]'>
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      data?.payload?.modules?.map((mod)=><SelectItem key={mod.id} value={mod.id}>{mod.name}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Group</label>
                <Select value={state.group} onValueChange={(val)=>setState({...state,group:val})}  disabled={isPending}>
                  <SelectTrigger className='min-w-[250px]'>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      data?.payload.groups?.[state.module]?.map((mod)=><SelectItem key={mod.id} value={mod.id}>{mod.name}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className=" flex flex-col gap-1">
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <Popover >
                    <PopoverTrigger asChild  disabled={isPending}>
                      <Button variant={"outline"} className='w-[250px] justify-start text-left '>
                        {state.att_date ? new Date(state.att_date).toDateString() : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' >
                  <Calendar mode='single' selected={state.att_date ? new Date(state.att_date) : undefined}  onSelect={(date)=>setState({...state,att_date:moment(date).format("YYYY-MM-DD")??""})}  disabled={(date) => date > new Date()} />
                      </PopoverContent>
                  </Popover>
                
              </div>
              <div className="flex items-end">
                <Button className="w-full" onClick={onSetFilter} disabled={isMutatePending|| !state.att_date || !state.group || !state.module}>
                  {
                    isMutatePending? <ServerRequestLoader/> : "Apply Filter"
                  }
                  </Button>
              </div>
      {
        isPending && <ServerRequestLoader size={32} stroke={4}/>
      }
            </div>
          </CardContent>
        </Card>
  )
}

export default AttendanceViewEachSelectbar