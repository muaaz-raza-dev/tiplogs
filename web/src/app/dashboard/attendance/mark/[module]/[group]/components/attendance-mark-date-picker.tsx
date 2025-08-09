import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useFetchMarkAttDateAndDocId } from '@/hooks/query/useMarkAttQ'
import { MarkAttendanceAtom } from '@/lib/atoms/mark-att.atom'
import { cn } from '@/lib/utils'
import { Button } from '@/shadcn/components/ui/button'
import { Calendar } from '@/shadcn/components/ui/calendar'
import { Label } from '@/shadcn/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover'
import { AxiosError } from 'axios'
import { useAtomValue } from 'jotai'
import { CalendarIcon } from 'lucide-react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

function AttendanceMarkDatePicker() {
  const [open,setOpen] = useState(false)
  const {general:{att_date}} = useAtomValue(MarkAttendanceAtom)
  const {isError,error,isPending,mutate} = useFetchMarkAttDateAndDocId()
  const Error = error as AxiosError<{message:string}>
  const [date,setDate] = useState(new Date())

  function ChangeDate(){
    if(att_date.toLocaleDateString()!=date.toLocaleDateString()){
        mutate(moment(date).format("YYYY-MM-DD") )
    }
  }
  useEffect(() => {
      mutate(moment().format("YYYY-MM-DD"))
  }, [])

  return ( <div className="">
    <Label className='pb-2'>Attendance date</Label>
    <div className="flex items-center gap-4">
     <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={isPending}>
        <Button
          variant="outline"
          className={cn('w-[220px] justify-start text-left font-normal')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? moment(date).format("dddd, DD-MM-YYYY"): <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} modifiers={{today:undefined}} onSelect={(date)=>{date&&setDate(date);setOpen(false)}} disabled={{ after: new Date() }}  />
      </PopoverContent>
    </Popover>
    <Button onClick={ChangeDate} variant={"secondary"}>{isPending ? <ServerRequestLoader/>:  "Change Date"} </Button>
    </div>
    {
      isError ? <p className='py-4 text-destructive'>{Error.response?.data.message}</p> : null
    }
    </div>
  )
}

export default AttendanceMarkDatePicker