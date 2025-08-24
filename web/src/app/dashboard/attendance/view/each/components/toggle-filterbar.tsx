import { Button } from '@/shadcn/components/ui/button'
import React from 'react'

function AttendanceViewToggleFilterbar() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              All
            </Button>
            <Button variant="ghost" size="sm" className="text-green-200">
              Present
            </Button>
            <Button variant="ghost" size="sm" className="text-red-200">
              Absent
            </Button>
            <Button variant="ghost" size="sm" className="text-yellow-200">
              Late
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-200">
              Excused
            </Button>
          </div>
        </div>
  )
}

export default AttendanceViewToggleFilterbar