import { AttOverviewDailyDocsAtom } from "@/lib/atoms/att-details-group-module.atom"
import { Badge } from "@/shadcn/components/ui/badge"
import { Button } from "@/shadcn/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { IattDetailsOverviewDoc } from "@/types/atoms/att-details-group-module.t"
import { useAtomValue } from "jotai"
import { ArrowRight } from "lucide-react"
import moment from "moment"

export default function AttendanceOverviewCards() {
    const records = useAtomValue(AttOverviewDailyDocsAtom)

    
  return (
        <div className="flex flex-wrap gap-2">
            {
                records.map(e=><AttendanceCard key={e.att_date} data={e}/>)
            }
        </div>
  )
}


function AttendanceCard({
    data:{att_date,is_base_exists,is_taken,att_group}
}: {data:IattDetailsOverviewDoc}) {
  if (!is_base_exists||!is_taken) {
    return (
      <Card className="w-[24%] ">
        <CardHeader className="flex justify-between">
            <div className="w-full">
          <CardTitle className="text-lg font-semibold ">{moment(att_date).format("dddd")}</CardTitle>
          <p className="text-sm text-muted-foreground">{moment(att_date).format("DD-MMMM-YYYY")}</p>
            </div>
            <div className="w-max flex flex-col gap-2 items-end ">
                { is_base_exists ?<Badge variant={"destructive"}>No Attendance</Badge> : <Badge variant={"destructive"}>Not taken</Badge>}
            </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center  text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className=" text-sm text-muted-foreground font-medium">Attendance Not Taken</p>
            <button className="text-primary cursor-pointer text-xs mt-1">Click to mark attendance</button>
          </div>
        </CardContent>
      </Card>
    )
  }
  const total = att_group? Object.values(att_group?.status_counts).reduce((count,i)=>count+i,0) : 0
  const attendanceRate = total ? Math.round(((att_group?.status_counts.present??0) / total) * 100) : 0

  return (
    <Card className="w-[24%] ">
      <CardHeader className="">
        <div className="flex justify-between">
            <div className="">
           <CardTitle className="text-lg font-semibold ">{moment(att_date).format("dddd")}</CardTitle>
          <p className="text-sm text-muted-foreground">{moment(att_date).format("DD-MMMM-YYYY")}</p>

            </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">{attendanceRate}%</div>
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col gap-2">
          {/* Attendance Rate */}

      

          {/* Additional Info */}
          <div className="flex gap-2 items-center flex-wrap text-sm ">
            <div className="flex bg-green-700 px-4 p-1 rounded-lg  text-black items-center gap-2 font-medium">
              Present
              <span className="font-semibold pl-2 border-l border-black">{att_group?.status_counts.present} </span>
            </div>
            <div className="flex bg-destructive px-4 p-1 rounded-lg  text-black items-center gap-2 font-medium">
              Absent
              <span className="font-semibold pl-2 border-l border-black">{att_group?.status_counts.absent} </span>
            </div>
            <div className="flex bg-yellow-700 px-4 p-1 rounded-lg  text-black items-center gap-2 font-medium">
              Late 
              <span className="font-semibold pl-2 border-l border-black">{att_group?.status_counts.late} </span>
            </div>
            <div className="flex bg-sky-600 px-4 p-1 rounded-lg  text-black items-center gap-2 font-medium">
              Leave
              <span className="font-semibold pl-2 border-l border-black ">{att_group?.status_counts.leave} </span>
            </div>
            <div className="flex bg-orange-400 px-4 p-1 rounded-lg  text-black items-center gap-2 font-medium">
              Half day
              <span className="font-semibold pl-2 border-l border-black ">{att_group?.status_counts.half} </span>
            </div>

          </div>
            <div className="text-xs text-muted-foreground">Total: {total}</div>
            <Button variant={"secondary"} className="w-full">View Details <ArrowRight/> </Button>
      </CardContent>
    </Card>
  )
}
