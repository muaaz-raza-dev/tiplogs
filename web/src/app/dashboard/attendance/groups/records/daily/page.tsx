"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Button } from "@/shadcn/components/ui/button"
import { Badge } from "@/shadcn/components/ui/badge"
import { CalendarDays, Users, BookOpen, Clock, ChevronLeft, ChevronRight, Plus, Pen, Trash,  ArrowRight } from "lucide-react"
import Filterbar from "./components/filterbar"
import WeekOverviewCards from "./components/week-overview-cards"

// Mock data for demonstration
const mockAttendanceData = [
  {
    id: 1,
    date: "2024-01-15",
    group: "Group A",
    module: "Mathematics",
    totalStudents: 25,
    presentStudents: 23,
    absentStudents: 2,
    attendanceRate: 92,
    students: [
      { name: "John Doe", status: "present" },
      { name: "Jane Smith", status: "present" },
      { name: "Mike Johnson", status: "absent" },
      { name: "Sarah Wilson", status: "present" },
    ],
  },
  {
    id: 2,
    date: "2024-01-15",
    group: "Group B",
    module: "Science",
    totalStudents: 20,
    presentStudents: 18,
    absentStudents: 2,
    attendanceRate: 90,
    students: [
      { name: "Alex Brown", status: "present" },
      { name: "Emma Davis", status: "absent" },
      { name: "Chris Lee", status: "present" },
      { name: "Lisa Garcia", status: "present" },
    ],
  },
  {
    id: 3,
    date: "2024-01-14",
    group: "Group A",
    module: "English",
    totalStudents: 25,
    presentStudents: 24,
    absentStudents: 1,
    attendanceRate: 96,
    students: [
      { name: "John Doe", status: "present" },
      { name: "Jane Smith", status: "present" },
      { name: "Mike Johnson", status: "present" },
      { name: "Sarah Wilson", status: "absent" },
    ],
  },
  {
    id: 4,
    date: "2024-01-14",
    group: "Group C",
    module: "History",
    totalStudents: 22,
    presentStudents: 20,
    absentStudents: 2,
    attendanceRate: 91,
    students: [
      { name: "Tom Anderson", status: "present" },
      { name: "Amy White", status: "absent" },
      { name: "David Miller", status: "present" },
      { name: "Sophie Taylor", status: "absent" },
    ],
  },
  {
    id: 5,
    date: "2024-01-13",
    group: "Group B",
    module: "Mathematics",
    totalStudents: 20,
    presentStudents: 19,
    absentStudents: 1,
    attendanceRate: 95,
    students: [
      { name: "Alex Brown", status: "present" },
      { name: "Emma Davis", status: "present" },
      { name: "Chris Lee", status: "absent" },
      { name: "Lisa Garcia", status: "present" },
    ],
  },
]


export default function AttendancePage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset)
    return monday
  })

  const getWeekDates = (startDate: Date) => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(currentWeekStart.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeekStart(newDate)
  }


  const getAttendanceForDate = (date: Date) => {

  }



  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  const formatWeekDate = (date: Date) => {
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return "bg-green-500"
    if (rate >= 85) return "bg-yellow-500"
    return "bg-red-500"
  }

  const weekDates = getWeekDates(currentWeekStart)
  const weekRange = `${currentWeekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-8 w-8 " />
            <h1 className="text-3xl font-bold text-foreground">Attendance Records</h1>
          </div>
          <p className="text-muted-foreground">
            Track and monitor student attendance across different groups and modules
          </p>
        </div>

        <Filterbar/>        
        <WeekOverviewCards/>

        {/* Results Summary */}
        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold text-foreground">Detailed Attendance Records</h2>
          <p className="text-sm text-muted-foreground">
            Showing 5  attendance records
          </p>
        </div>

        {/* Attendance Cards */}
        <div className="grid gap-6">

          {[].length === 1 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Records Found</h3>
                  <p className="text-muted-foreground">No attendance records match your current filters.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            mockAttendanceData.map((record) => (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div>
                        <CardTitle className="text-xl ">{formatDate(record.date)}</CardTitle>
                        <p className="text-sm text-muted-foreground">{record.date}</p>
                      </div>
                      <div className="flex items-center  space-x-2">
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{record.group}</span>
                        </Badge>
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{record.module}</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getAttendanceColor(record.attendanceRate)}`}></div>
                        <span className="text-2xl font-bold text-foreground">{record.attendanceRate}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="">
                    {/* Statistics */}
                    <div className="w-full flex ">
                      
                    
                    <div className="space-y-4 w-1/2">
                      <h4 className="font-semibold text-foreground">Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Students:</span>
                          <span className="text-sm font-medium">{record.totalStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Present:</span>
                          <span className="text-sm font-medium text-green-600">{record.presentStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Absent:</span>
                          <span className="text-sm font-medium text-red-600">{record.absentStudents}</span>
                        </div>
                      </div>
                    </div>

              <div className=" w-1/2 self-end  flex flex-col gap-2 justify-end items-end">
              <Button size={"sm"} variant={"destructive"}>Delete <Trash/> </Button>
              <Button variant={"outline"}>Edit Attedance <Pen/> </Button>
              <Button >View Details <ArrowRight /> </Button>
                      
                      </div>
                        
                </div>
                      
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
