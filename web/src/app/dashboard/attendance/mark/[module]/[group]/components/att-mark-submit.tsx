import { MarkAttendanceListAtom } from '@/lib/atoms/mark-att.atom'
import { Button } from '@/shadcn/components/ui/button'
import { useAtomValue } from 'jotai'
import { Save } from 'lucide-react'
import React from 'react'

function AttMarkSubmit() {
  const attendance = useAtomValue(MarkAttendanceListAtom)
  const unmarked =attendance.reduce((count, item) => count + (item.status == "" ? 1 : 0), 0)
  return (
    <div className='w-full flex justify-end items-center'>
        <Button disabled={unmarked==0}><Save/> Submit Attendance  </Button>
    </div>
  )
}

export default AttMarkSubmit