import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Label } from "@/shadcn/components/ui/label"
import { Input } from "@/shadcn/components/ui/input"
import { Button } from "@/shadcn/components/ui/button"
import {  Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select"
import { useGetAttModulesUserSpecific, useScheduleAttendance } from '@/hooks/query/useAttQ'
import { useRouter, useSearchParams } from 'next/navigation'
import ServerRequestLoader from '@/components/loaders/server-request-loader'

function ScheduleAttBar() {
    const [date,setDate] = useState("" )
    const {mutateAsync,isPending} = useScheduleAttendance()
    async function Schedule(){
        await mutateAsync({att_date:date})
        setDate("")
    }
  return (
    <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule upcoming attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 flex gap-2 items-center w-full">
            <ModuleSelect/>
              <div className="space-y-2 w-[35%]">
                <Label htmlFor="date">Select Attendance Date</Label>
                <Input id="date" type="date" min={new Date().toISOString().split("T")[0]} required className="w-full" value={date} onChange={({target:{value}})=>setDate(value)}/>
              </div>
              <Button disabled={isPending||!date} type="submit" onClick={Schedule}>
                {isPending ?  <ServerRequestLoader/>: "Schedule Attendance"}
                </Button>
            </div>
          </CardContent>
        </Card>
  )
}

function ModuleSelect(){
    const {data,isPending} = useGetAttModulesUserSpecific()
    const [modules,setModules]  = useState(data?.payload.modules.filter(e=>e.frequency=="custom"))
    const searchParams = useSearchParams()
    const module = searchParams.get("module") || ""
    const router = useRouter()

    function onModuleChange(newModule: string) {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (newModule) {
    newSearchParams.set('module', newModule)
    } else {
    newSearchParams.delete('module')
    }
    const newUrl = `/dashboard/attendance/schedule?${newSearchParams.toString()}`
    router.replace(newUrl)
    }

    useEffect(() => { if(data){setModules(data?.payload.modules.filter(e=>e.frequency=="custom"))}}, [data])

    return        <div className="flex flex-col gap-2 w-[35%]">
            <label htmlFor="module-select" className="text-sm font-medium text-muted-foreground">
         Attedance Module
            </label>
            <Select value={module} disabled={isPending} onValueChange={(e)=>onModuleChange(e)}>
              <SelectTrigger className="w-full" >
                <SelectValue placeholder="Select a module" />
              </SelectTrigger>
              <SelectContent>
                {modules?.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
}

export default ScheduleAttBar