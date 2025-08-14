import { MarkAttendanceAtom } from '@/lib/atoms/mark-att.atom'
import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import React from 'react'

function AttStateNotifier() {
    const {general:{is_holiday,status}} = useAtomValue(MarkAttendanceAtom)
  return (
    <div className={clsx('w-full p-4 text-center rounded-md  text-black font-bold text-xl',status == "complete"&&(is_holiday ?"bg-sky-200 ": "bg-red-200"))}>
        {
            status=="complete"&& (is_holiday ? "Today is assigned as holiday": "The attendance is already taken" )
        }
    </div>
  )
}

export default AttStateNotifier