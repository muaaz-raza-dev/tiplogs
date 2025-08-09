import { MarkAttendanceListAtom } from '@/lib/atoms/mark-att.atom'
import { Badge } from '@/shadcn/components/ui/badge'
import { Button } from '@/shadcn/components/ui/button'
import { Card, CardContent } from '@/shadcn/components/ui/card'
import { AttendanceStatus } from '@/types/atoms/mark-attendance'
import { useAtom, useAtomValue } from 'jotai'
import { CheckCircle2, Circle, RotateCcw } from 'lucide-react'
import React from 'react'

function BatchActionBar() {
  const [Attendance,setAttendace] = useAtom(MarkAttendanceListAtom)
  function MarkAll(status:AttendanceStatus){
    setAttendace(Attendance.map(e=>({...e,status:status})))
  }
  
  return (

      <Card className="mb-4">
        <CardContent className="">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 md:w-auto">
              <Button
                onClick={()=>MarkAll("present")}
                variant="outline"
                className="gap-2 whitespace-nowrap"
              >
                <CheckCircle2 className="h-4 w-4 text-green-800" />
                Mark All Present
              </Button>
              <Button
                onClick={()=>MarkAll("absent")}
                variant="outline"
                className="gap-2 whitespace-nowrap"
              >
                <Circle className="h-4 w-4 text-red-600" />
                Mark All Absent
              </Button>
           

              <Button variant="ghost"  className="gap-2 whitespace-nowrap"  onClick={()=>MarkAll("")}>
                <RotateCcw className="h-4 w-4" />
                Reset All
              </Button>
            </div>
            <StatusesCount/>
          </div>
        </CardContent>
      </Card>
  )
}

function StatusesCount(){
  const attendance = useAtomValue(MarkAttendanceListAtom)
  const presents = attendance.reduce((count,item)=>count+(item.status=="present"?1:0),0)
  const absents = attendance.reduce((count,item)=>count+(item.status=="absent"?1:0),0)
  const leaves = attendance.reduce((count,item)=>count+(item.status=="leave"?1:0),0)
  const halfs = attendance.reduce((count,item)=>count+(item.status=="half_day"?1:0),0)
  const lates = attendance.reduce((count,item)=>count+(item.status=="late"?1:0),0)
  return <div className="flex items-center gap-2">
              <Badge className="text-green-50 bg-green-800">P : {presents}</Badge>
              <Badge className="text-red-50 bg-red-800">A : {absents}</Badge>
              <Badge className="text-orange-50 bg-orange-800">L : {lates}</Badge>
              <Badge className="text-yellow-50 bg-yellow-800">H : {halfs}</Badge>
              <Badge className="text-sky-50 bg-sky-800">Lv : {leaves}</Badge>
            </div>
}

export default BatchActionBar