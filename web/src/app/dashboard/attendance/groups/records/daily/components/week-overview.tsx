import React from 'react'
import { Card, CardContent } from "@/shadcn/components/ui/card"
import WeekDateSelector from './week-date-selector'
import AttendanceOverviewCards from './att-overview-card'

function WeekOverview() {
  return (
        <Card>
          <WeekDateSelector/>
          <CardContent>
            <AttendanceOverviewCards/>
            </CardContent>
        </Card>
    
  )
}

export default WeekOverview