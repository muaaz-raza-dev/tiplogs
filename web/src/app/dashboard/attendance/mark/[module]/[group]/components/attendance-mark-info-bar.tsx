import React from 'react'
import { Card, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { Users } from 'lucide-react'
import AttendanceMarkDatePicker from './attendance-mark-date-picker'
import { useAtomValue } from 'jotai'
import { MarkAttendanceAtom } from '@/lib/atoms/mark-att.atom'
import moment from 'moment'

function AttendanceMarkInfoBar() {
  const state = useAtomValue(MarkAttendanceAtom)
  return (
    <>


    <Card className="mb-4 w-full">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{state.group.name}</h1> 
            {
              state.general.att_date ?
            <h2 className='text-muted-foreground text-sm'>{moment(state.general.att_date).format("dddd DD-MMMM-YYYY")}</h2> :
            <p className='text-destructive text-sm px-2'>No date selected</p>
          }
          </div>      
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-muted-foreground" /> {state.module.name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>
                {state.general.total_individuals} individuals • {state.general.unmarked} unmarked
              </span>
            </div>
          </div>

          <AttendanceMarkDatePicker/>
          


        </CardHeader>
        
        
      </Card>
    </>
  )
}
export default AttendanceMarkInfoBar

