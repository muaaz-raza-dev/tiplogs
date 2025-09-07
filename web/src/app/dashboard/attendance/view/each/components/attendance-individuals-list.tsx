"use client";
import { AttViewEachFilterAtom, AttViewEachListAtom } from '@/lib/atoms/att-view-each.atom'
import { Badge } from '@/shadcn/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { AttendanceStatus } from '@/types/atoms/mark-attendance.t';
import { useAtomValue } from 'jotai'
import { Users } from 'lucide-react'
import moment from 'moment';
import React, { useEffect } from 'react'

function AttendanceIndividualsList() {
      const data = useAtomValue(AttViewEachListAtom) 
      const filters = useAtomValue(AttViewEachFilterAtom) 
      const [attendanceList, setAttendanceList] = React.useState(data.attendances);
      useEffect(() => {
        if (data.attendances.length){
            const filtered =(filters.status_selected != "" ) ?data?.attendances?.filter(att => att.status === filters.status_selected):data?.attendances
              setAttendanceList(filtered)
        }
      }, [data.is_taken,filters.status_selected])
      const getStatusBadge = (status: Omit<AttendanceStatus,"">) => {
        switch (status) {
          case "present":
            return <Badge className="bg-green-100 text-green-800 ">Present</Badge>
          case "absent":
            return <Badge className="bg-red-100 text-red-800 ">Absent</Badge>
          case "late":
            return <Badge className="bg-yellow-100 text-yellow-800 ">Late</Badge>
          case "half_day":
            return <Badge className="bg-orange-100 text-orange-800 ">Late</Badge>
          case "leave":
            return <Badge className="bg-blue-100 text-blue-800 ">Excused</Badge>
          default:
            return <Badge variant="secondary">{status}</Badge>
        }
      }
    
        return (
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  
                  <div className="flex items-center gap-2">

                  <Users className="h-5 w-5" />
                  Attendance List - {moment(filters.att_date).format("dddd DD-MMMM-YYYY")}
                  </div>

          <div className="flex justify-between gap-4 items-center border rounded p-1 px-2 text-sm">
                  <span className=" text-muted-foreground">Total Students</span>
                  <span className="font-semibold">{data.attendances.length}</span>
                </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {
                    attendanceList?.length == 0 &&
                    <div className="text-center py-10 text-sm text-muted-foreground">No records in this category found</div>
                  }
                  {attendanceList?.map((e) => (
                    <div
                    key={e.individual.id}
                    className="flex items-center justify-between p-4 border rounded-lg "
                    >
                      <div className="flex  gap-2 items-center text-sm">
                        <Badge variant={"secondary"} className='h-full'>{e.individual.grno} </Badge>
                        
                            <div className="flex gap-2 items-center"> <p className="font-medium "> {e.individual.full_name}</p> 
                            {e.individual.roll_no &&
                            <Badge variant={"outline"}>{e.individual.roll_no||"-"}</Badge>
                            }
                            </div> -
                          <p className=" text-muted-foreground">{e.individual.father_name}</p>
                        
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-center">{e.reporting_time}</p>
                          <p className="text-xs text-muted-foreground">{e.att_note}</p>
                        </div>
                        {getStatusBadge(e.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
  )

}

export default AttendanceIndividualsList