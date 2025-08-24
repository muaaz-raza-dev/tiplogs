import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import React from 'react'

function AttendanceStatsCard() {
  return (
    <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Students</span>
                  <span className="font-semibold">{100}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm ">Present</span>
                  <span className="font-semibold text-green-300">{100}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm ">Absent</span>
                  <span className="font-semibold text-red-300">{100}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm ">Late</span>
                  <span className="font-semibold text-yellow-300">{100}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm ">Excused</span>
                  <span className="font-semibold text-blue-300">{100}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Attendance Rate</span>
                    <span className="font-semibold text-green-300">
                      {Math.round((100 / 100) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
  )
}

export default AttendanceStatsCard