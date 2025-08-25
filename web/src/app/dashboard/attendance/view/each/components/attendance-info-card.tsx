"use client";
import { AttViewEachListAtom } from '@/lib/atoms/att-view-each.atom'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { useAtomValue } from 'jotai'
import {  Clock, User } from 'lucide-react'
import moment from 'moment'
import React from 'react'

function AttendanceTakenInfoCard() {
  const data = useAtomValue(AttViewEachListAtom)
  
  return (
    <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Taken by</p>
                    <p className="text-sm ">{data.attendance_meta.taken_by.full_name} - {data.attendance_meta.taken_by.username}  </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm ">{moment(data.attendance_meta.created_at).format("dddd DD-MMMM-YY hh:mm:ss ")}</p>
                  </div>
                </div>


                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Last updated: {moment(data.attendance_meta.updated_at).format("dddd DD-MMMM-YY hh:mm:ss ")}</p>
                </div>
              </CardContent>
            </Card>
  )
}

export default AttendanceTakenInfoCard