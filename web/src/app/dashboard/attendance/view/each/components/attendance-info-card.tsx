import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { BookOpen, Clock, User } from 'lucide-react'
import React from 'react'

function AttendanceTakenInfoCard() {
  return (
    <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Taken by</p>
                    <p className="text-sm ">Prof. Michael Johnson</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm ">March 15, 2024 at 9:00 AM</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Session</p>
                    <p className="text-sm ">Lecture 12: Object-Oriented Programming</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Last updated: March 15, 2024 at 10:30 AM</p>
                </div>
              </CardContent>
            </Card>
  )
}

export default AttendanceTakenInfoCard