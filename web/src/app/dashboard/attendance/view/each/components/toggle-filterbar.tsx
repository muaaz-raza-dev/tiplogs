import { AttViewEachFilterAtom } from '@/lib/atoms/att-view-each.atom'
import { Button } from '@/shadcn/components/ui/button'
import { AttendanceStatus } from '@/types/atoms/mark-attendance.t'
import { useAtom } from 'jotai'
import React from 'react'

function AttendanceViewToggleFilterbar() {
  const [state,setState] = useAtom(AttViewEachFilterAtom)
  function ToggleStatuses(status:AttendanceStatus){
    setState({...state,status_selected:status})
  }
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={()=>ToggleStatuses("")}>
              All
            </Button>
            <Button variant="ghost" size="sm" className="text-green-300" onClick={()=>ToggleStatuses("present")}>
              Present
            </Button>
            <Button variant="ghost" size="sm" className="text-red-300" onClick={()=>ToggleStatuses("absent")}>
              Absent
            </Button>
            <Button variant="ghost" size="sm" className="text-yellow-300" onClick={()=>ToggleStatuses("late")}>
              Late
            </Button>
            <Button variant="ghost" size="sm" className="text-orange-300" onClick={()=>ToggleStatuses("half_day")}>
              Late
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-300" onClick={()=>ToggleStatuses("leave")}>
              Leave
            </Button>
          </div>
        </div>
  )
}

export default AttendanceViewToggleFilterbar