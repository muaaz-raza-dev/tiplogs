import ServerRequestLoader from '@/components/loaders/server-request-loader';
import { useAttendanceWeeklyOverview } from '@/hooks/query/useAttQ';
import { AttOverviewDailyFiltersAtom } from '@/lib/atoms/att-details-group-module.atom';
import { cn } from '@/lib/utils';
import { Badge } from '@/shadcn/components/ui/badge';
import { Button } from '@/shadcn/components/ui/button';
import { Calendar } from '@/shadcn/components/ui/calendar';
import { CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { Popover, PopoverContent } from '@/shadcn/components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { useAtom } from 'jotai';
import { ArrowRight, CalendarIcon } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useState } from 'react'

function WeekDateSelector() {
   const [start_date,setStartDate] = useState<Date>(new Date())
  const {mutate,isPending} = useAttendanceWeeklyOverview()
  const [state,setState] = useAtom(AttOverviewDailyFiltersAtom)
  useEffect(() => {
    if (state.group&&state.module){
        mutate(state)
    }
  }, [state.group])
  function handleDateChange( date: Date|undefined ){
    if (date){
        setStartDate(date)
        mutate({...state,start_date:moment(date).format("YYYY-MM-DD")})
        setState({...state,start_date:moment(date).format("YYYY-MM-DD")})
    }
  }
  return (
    <>
    <CardHeader>
              <CardTitle className="text-xl">Week's Attendance overview</CardTitle>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex gap-2 items-center">
                <Badge className=" text-base font-medium px-4" variant={"secondary"}>{moment(start_date).format("dddd DD MMMM YYYY")  }</Badge>
                    <ArrowRight size={18}/>
                    <Badge className=" text-base font-medium px-4" variant={"secondary"}>{moment(start_date).add(-6, 'days').format("dddd DD MMMM YYYY")} </Badge>

                </div>
    <div className="">
        <div className="flex items-center gap-4">
                
                <Popover >
      <PopoverTrigger asChild disabled={isPending}>
        <Button variant="outline" className={cn('w-[220px] justify-start text-left font-normal')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {start_date? moment(start_date).format("dddd, DD-MM-YYYY"): <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={start_date} modifiers={{today:undefined}} onSelect={handleDateChange} disabled={{ after: new Date() }}  />
      </PopoverContent>
    </Popover>
            {  isPending && <ServerRequestLoader/> }
      </div>
    <p className="text-xs text-muted-foreground pt-1"> Select any date within the week.</p>
    </div>
              </div>

          </CardHeader>

    </>
  )
}

export default WeekDateSelector