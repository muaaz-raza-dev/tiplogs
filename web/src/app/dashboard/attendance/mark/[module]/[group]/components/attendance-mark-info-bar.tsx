import React from 'react'
import { Card, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { Badge } from '@/shadcn/components/ui/badge'
import { ChevronLeft, Lock, Users } from 'lucide-react'
import AttendanceMarkDatePicker from './attendance-mark-date-picker'
import { Button } from '@/shadcn/components/ui/button'
import Link from 'next/link'
import { useAtomValue } from 'jotai'
import { MarkAttendanceAtom, MarkAttendanceListAtom } from '@/lib/atoms/mark-att.atom'

function AttendanceMarkInfoBar() {
  const state = useAtomValue(MarkAttendanceAtom)
  return (
    <>
    <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/groups" aria-label="Back to Groups Overview">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">{'Back'}</span>
            </Link>
          </Button>
            <h1 className='font-semibold'>Mark Attendance</h1>
          
        </div>
      </div>

    <Card className="mb-4 w-full">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3.5 w-3.5" />
              Locked Group
            </Badge>
            <h1 className="text-xl font-semibold">{state.group.name}</h1>
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

