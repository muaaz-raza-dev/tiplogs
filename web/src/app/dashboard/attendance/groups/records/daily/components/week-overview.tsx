import React from 'react'
import { Card, CardContent, CardHeader } from "@/shadcn/components/ui/card"
import { Button } from '@/shadcn/components/ui/button'
import { Clock, Plus } from 'lucide-react'
import { Badge } from '@/shadcn/components/ui/badge'
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