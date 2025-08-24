"use client"

import { CalendarDays } from "lucide-react"
import Filterbar from "./components/filterbar"
import WeekOverview from "./components/week-overview"

// Mock data for demonstration



export default function AttendancePage() {

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="w-full mx-auto space-y-6">
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
        <WeekOverview/>

     
      </div>
    </div>
  )
}
