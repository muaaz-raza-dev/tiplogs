"use client";
import { AttViewEachFilterAtom, AttViewEachListAtom, defaultAttendanceDetailedView, defaultAttViewFilters } from '@/lib/atoms/att-view-each.atom'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { useAtom, useAtomValue } from 'jotai'
import {  Clock, User } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import AttDeleteButton from '../../../groups/records/daily/components/att-delete-button';

function AttendanceTakenInfoCard() {
  const [data,setData] = useAtom(AttViewEachListAtom)
  const [filters,setFilters] = useAtom(AttViewEachFilterAtom)
  function onDelete(){
    setFilters(defaultAttViewFilters)
    setData(defaultAttendanceDetailedView)
  }

  return (
    <Card className='gap-2'>
              <CardHeader>
                <CardTitle className="">Attendance Logs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground ">{data?.attendance_meta?.taken_by?.full_name} - {data?.attendance_meta?.taken_by?.username}  </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{moment(data?.attendance_meta?.created_at).format("dddd DD-MMMM-YY hh:mm:ss ")}</p>
                  </div>
                </div>


                <div className="border-t py-2">
                  <p className="text-xs text-muted-foreground">Last updated: {moment(data?.attendance_meta?.updated_at).format("dddd DD-MMMM-YY hh:mm:ss ")}</p>
                </div>

                <div className="">
                  <AttDeleteButton att_group={data.attendance_meta.att_group_id} att_date={filters.att_date} onDelete={onDelete}/>
                </div>
              </CardContent>
              
            </Card>
  )
}

export default AttendanceTakenInfoCard