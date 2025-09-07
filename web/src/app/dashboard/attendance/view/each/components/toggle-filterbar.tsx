"use client";
import { AttViewEachFilterAtom } from '@/lib/atoms/att-view-each.atom'
import { Button } from '@/shadcn/components/ui/button'
import { AttendanceStatus } from '@/types/atoms/mark-attendance.t'
import clsx from 'clsx';
import { useAtom } from 'jotai'
import React from 'react'
const TextColorMaps = {
"All":"text-white",
"Present":"text-green-400",
"Absent":"text-red-400",
"Late":"text-yellow-400",
"Half Day":"text-orange-400",
"Leave":"text-sky-400",
}
function AttendanceViewToggleFilterbar() {
  const [state,setState] = useAtom(AttViewEachFilterAtom)
  function ToggleStatuses(status:AttendanceStatus | "All"){
    const Status = status.toLowerCase() as AttendanceStatus
    setState({...state,status_selected:status == "All" ? "" :  Status })
  }
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div className="flex items-center gap-2">
            {
              ["All","Present","Absent","Late","Half Day","Leave"].map((e)=><Button variant={state.status_selected==""&&e=="All"? "outline":state.status_selected==e.toLowerCase()?"outline":"ghost"} size="sm" onClick={()=>ToggleStatuses(e as AttendanceStatus | "All")} key={e} 
              className={clsx("hover:bg-transparent",TextColorMaps[e as keyof typeof TextColorMaps],)}
              >
              {e}
            </Button>)
            }
            
          </div>
        </div>
  )
}

export default AttendanceViewToggleFilterbar