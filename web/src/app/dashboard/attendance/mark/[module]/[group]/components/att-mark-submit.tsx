import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useMarkAttendance } from '@/hooks/query/useMarkAttQ'
import { MarkAttendanceAtom } from '@/lib/atoms/mark-att.atom'
import { Button } from '@/shadcn/components/ui/button'
import { AxiosError } from 'axios'
import { useAtomValue } from 'jotai'
import { Save } from 'lucide-react'
import React from 'react'

function AttMarkSubmit() {
  const {mutate:submit,isPending,isError,error} = useMarkAttendance() 
  const Error = error as AxiosError<{message:string}>
  const attendance = useAtomValue(MarkAttendanceAtom)
  function MarkAttendance(){
    if(attendance.general.unmarked==0){
        submit()
    }
  }
  return (
    <div className='w-full flex justify-end items-center'>
      {isError&& <p className='text-sm text-destructive'>{Error?.response?.data.message}</p>}
      <p className='text-sm text-destructive'>{Error?.response?.data.message}</p>
        <Button onClick={MarkAttendance} disabled={attendance.general.unmarked!=0}>
          {
            isPending ? <ServerRequestLoader/> : <><Save/> Submit Attendance  </>
          }
          
          </Button>
    </div>
  )
}

export default AttMarkSubmit