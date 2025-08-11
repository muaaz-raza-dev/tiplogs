import { MarkAttendanceAtom, MarkAttendanceListAtom } from "@/lib/atoms/mark-att.atom";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/ui/avatar";
import { Button } from "@/shadcn/components/ui/button";
import { Card } from "@/shadcn/components/ui/card";
import { Input } from "@/shadcn/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/components/ui/table";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/shadcn/components/ui/toggle-group";
import { AttendanceStatus } from "@/types/atoms/mark-attendance";
import clsx from "clsx";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Notebook, Paperclip } from "lucide-react";
import React, { useState } from "react";
import { AttNoteDialog } from "./att-note-dialog";
const status_colors:{[key:string]:string} = {
  "present":"bg-green-800",
  "absent":"bg-red-800",
  "leave":"bg-sky-800",
  "late":"bg-orange-800",
  "half_day":"bg-yellow-800",
  "unmarked":"bg-[#40404040]"
}
const Readable_Statuses={
  "present":"Present",
  "absent":"Absent",
  "leave":"Leave",
  "late":"Late",
  "half_day":"Half Day",
  "":"Unmarked",


}
function AttMarkIndividualList() {
  const [Attendances,setAttendances] = useAtom(MarkAttendanceListAtom)
  const [attendanceState,setAttendanceState] = useAtom(MarkAttendanceAtom)
  const [selectedNote,setSelectedNote] = useState({index:-1,note:""})

  function handleStatusChange(key:number,status:AttendanceStatus){
    const attendance= Attendances.map((s,index)=>{        
      if (index==key){
        return {...s, status : s.status==status?"":status}
      }
      return s
    })
    setAttendances(attendance)

    setAttendanceState({...attendanceState,general:{...attendanceState.general,unmarked:attendance.reduce((count,item)=>(count+(item.status==""?1:0)),0)}})
  }
  function ChangeReportingTime(time:string,i:number){
    const attendance= Attendances.map((s,index)=>{        
      if (index==i){
        return {...s,reporting_time:time}
      }
      return s
    })
    setAttendances(attendance)

  }

  return (
    <Card className="mb-28 md:mb-8">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Roll No</TableHead>
              <TableHead>Individual information</TableHead>
              <TableHead>Reporting time</TableHead>
              <TableHead className="">Mark Attendance</TableHead>
              <TableHead className="">Selected Attendance</TableHead>
              <TableHead className="">Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              Attendances.map((s,index)=>{return(
            <TableRow key={s.individual.grno}>
              <TableCell className="font-mono text-center  text-muted-foreground">
                {s.individual.roll_no ?? "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={s.individual.photo||"/placeholder.svg"}
                      alt={`${s.individual.full_name} photo`}
                    />
                    <AvatarFallback>{s.individual.full_name.split("")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <div className="font-medium">{s.individual.full_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.individual.father_name}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Input type="time" className="w-full " value={s.reporting_time} onChange={({target:{value}})=>ChangeReportingTime(value,index)}/>
              </TableCell>
              <TableCell>
                <ToggleGroup type="single" className="flex flex-wrap gap-2" value={s.status} onValueChange={(v:AttendanceStatus)=>handleStatusChange(index,v)} >
                  <ToggleChip value="present" label="Present" color="green" />
                  <ToggleChip value="absent" label="Absent" color="red" />
                  <ToggleChip value="late" label="Late" color="orange" />
                  <ToggleChip value="half_day" label="Half day" color="yellow" />
                  <ToggleChip value="leave" label="Leave" color="blue" />
                </ToggleGroup>
              </TableCell>
              <TableCell className="">
                <p className={clsx(" rounded-md border text-[13px] transition-colors px-4 py-1 font-medium w-max",status_colors[s.status||"unmarked"])}>{Readable_Statuses[s.status]}</p>
              </TableCell>
              <TableCell className="">
                <Button  onClick={()=>setSelectedNote({index:index,note:s.att_note??""})} variant={"ghost"}><Paperclip/> Note</Button>
              </TableCell>
            </TableRow>
              )})
            }
          </TableBody>
        </Table>
      </div>
      <AttNoteDialog noteState={selectedNote}/>
    </Card>
  );
}

function ToggleChip({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: "green" | "red" | "yellow" | "orange" | "blue";
}) {
  const base =
    color === "green"
      ? "text-green-400 "
      : color === "red"
      ? "text-red-400 "
      : color === "yellow"
      ? "text-yellow-400 "
      : color === "orange"
      ? "text-orange-400 "
      : "text-sky-300 ";
  return (
    <ToggleGroupItem
      value={value}
      aria-label={value}
 className={clsx(
    " rounded-md border text-[12px] !px-4 !font-medium transition-colors ",base)}

    >
      {label}
    </ToggleGroupItem>
  );
}

export default AttMarkIndividualList;
