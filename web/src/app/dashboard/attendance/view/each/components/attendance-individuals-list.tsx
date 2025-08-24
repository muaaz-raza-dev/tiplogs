import { Badge } from '@/shadcn/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { Separator } from '@/shadcn/components/ui/separator'
import { Users } from 'lucide-react'
import React from 'react'
const attendanceData = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      status: "present",
      time: "09:15 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      status: "absent",
      time: "-",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@email.com",
      status: "present",
      time: "09:05 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily.brown@email.com",
      status: "late",
      time: "09:45 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@email.com",
      status: "present",
      time: "09:10 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      status: "absent",
      time: "-",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 7,
      name: "James Taylor",
      email: "james.taylor@email.com",
      status: "present",
      time: "09:20 AM",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 8,
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      status: "excused",
      time: "-",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

function AttendanceIndividualsList() {
      const getStatusBadge = (status: string) => {
        switch (status) {
          case "present":
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Present</Badge>
          case "absent":
            return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Absent</Badge>
          case "late":
            return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Late</Badge>
          case "excused":
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Excused</Badge>
          default:
            return <Badge variant="secondary">{status}</Badge>
        }
      }
    

  return (
    <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Attendance List - CS101 Programming Fundamentals (Group A)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceData.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg "
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant={"secondary"} className='h-full'>29 </Badge>
                        <div>
                            <div className="flex gap-2 items-center"> <p className="font-medium "> {student.name}</p> <Badge variant={"outline"}>5645ba</Badge>
                            </div>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-center">{student.time}</p>
                          <p className="text-xs text-muted-foreground">Check-in time</p>
                        </div>
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
  )
}

export default AttendanceIndividualsList