"use client";
import { AttViewEachListAtom } from '@/lib/atoms/att-view-each.atom'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { useAtomValue } from 'jotai'
import React from 'react'

function AttendanceStatsCard() {
  const data = useAtomValue(AttViewEachListAtom)
  return (
    <Card className='gap-2'>
              <CardHeader>
                <CardTitle className="">Attendance Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
          
                <div className="flex justify-between items-center">
                  <span className="text-sm ">Present</span>
                  <span className="font-semibold text-green-400">{data?.overview?.present}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm ">Absent</span>
                  <span className="font-semibold text-red-400">{data?.overview?.absent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm ">Late</span>
                  <span className="font-semibold text-yellow-400">{data?.overview?.late}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm ">Half day</span>
                  <span className="font-semibold text-orange-400">{data?.overview?.half}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm ">Leave</span>
                  <span className="font-semibold text-blue-400">{data?.overview?.leave}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Attendance Rate</span>
                    <span className="font-semibold ">
                      {Math.round((data?.overview?.present / data?.overview?.total) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
  )
}

export default AttendanceStatsCard