"use client"
import { Settings } from "lucide-react"
import { AttViewEachFilterAtom, AttViewEachListAtom } from '@/lib/atoms/att-view-each.atom'
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { CalendarX } from "lucide-react"
import { useAtomValue } from 'jotai'
import React from 'react'
import moment from 'moment'
import { Badge } from "@/shadcn/components/ui/badge"

function AttendanceViewManager({children}:{children:React.ReactNode}) {
    const data = useAtomValue(AttViewEachListAtom) 
    const filters = useAtomValue(AttViewEachFilterAtom) 
    if(filters.is_fetched ){
      if (!data.is_attendance || !data.is_taken){

        return (
          <Card className="w-full max-w-md mx-auto gap-4">
      <CardHeader className="text-center ">
        <div className="mx-auto  flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <CalendarX className="h-8 w-8 text-muted-foreground" />
        </div>

        <CardTitle className=" font-semibold ">No Attendance Recorded
        </CardTitle>
        <p  className="font-medium text-muted-foreground text-sm ">{moment(filters.att_date).format("dddd DD-MMMM-YYYY")}</p>
      </CardHeader>
      <CardContent className="text-center border-t pt-4">
        <div className="flex flex-col items-start justify-center  mb-2 text-sm w-full">
        
          
        <div className="flex items-center justify-between w-full gap-2 mb-2 text-sm">
        <p className="text-muted-foreground ">Overall attendance </p>
        {

          !data.is_attendance ?
          <Badge variant={"destructive"}>Not taken</Badge>
          :
          <Badge variant={"default"} className="bg-green-300 text-green-950">Taken</Badge>
        }
        </div>
        
      
        <div className="flex items-center justify-between w-full gap-2 mb-2 text-sm">
        <p className="text-muted-foreground ">Attendance of the selected group </p>
        <Badge variant={"destructive"}>Not taken</Badge>
        </div>
        </div>

        
      </CardContent>
    </Card>
  )
}
else {
  return children
}
}
return (



    <Card className="w-full max-w-md mx-auto gap-0">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto  flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Settings className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl font-semibold">Select Attendance Filters</CardTitle>
      </CardHeader>
      <CardContent className="text-center my-0">
        <p className="text-sm text-muted-foreground ">
          Once all selections are made, attendance records will be displayed.
        </p>
      </CardContent>
    </Card>
  )




    }


export default AttendanceViewManager