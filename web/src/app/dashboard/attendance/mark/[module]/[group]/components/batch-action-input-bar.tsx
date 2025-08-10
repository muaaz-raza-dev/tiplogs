import { MarkAttendanceListAtom } from '@/lib/atoms/mark-att.atom'
import { Button } from '@/shadcn/components/ui/button'
import { Card, CardContent } from '@/shadcn/components/ui/card'
import { Input } from '@/shadcn/components/ui/input'
import { Label } from '@/shadcn/components/ui/label'
import { useAtom } from 'jotai'
import React, { useState } from 'react'

function BatchActionInputBar() {
    const [individuals ,setIndividuals]= useAtom(MarkAttendanceListAtom)
    const[time,setTime] = useState((new Date().toLocaleTimeString()).split(":").slice(0,2).join(":"))
    function UpdateReportingTime(){
        setIndividuals(individuals.map(e=>({...e,reporting_time:time})))
    }
  return (

          <Card className="mb-4">
        <CardContent className="">
            <div className="flex gap-3 items-end">

            <div className="min-w-1/4">
            <Label className='pb-2'>Update Reporting time </Label>
            <Input type='time' value={time} onChange={({target:{value}})=>setTime(value)} />
            </div>
            <Button disabled={time==""} variant={"outline"} onClick={UpdateReportingTime}>Update all</Button>
            </div>

            </CardContent>
            </Card>
  )
}

export default BatchActionInputBar