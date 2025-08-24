"use client"
import ScheduleAttBar from "./components/schedule-att-bar"
import ScheduledAttListing from "./components/scheduled-att-listing"



export default function AttendancePage() {



  
  return (
    <div className=" bg-background p-6">
      <div className=" mx-auto space-y-8">
        {/* Header */}
        <div className="text">
          <h1 className="text-3xl font-bold text-foreground mb-2">Schedule Custom Attendance</h1>
          <p className="text-muted-foreground">Register and manage upcoming attendance dates</p>
        </div>

      <ScheduleAttBar/>
      <ScheduledAttListing/>
      </div>
    </div>
  )
}
