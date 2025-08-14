import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Button } from '@/shadcn/components/ui/button'
import { ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react'
import { Badge } from '@/shadcn/components/ui/badge'

function WeekOverviewCards() {
  return (
    
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Week's Attendance</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-4">ASFSADF</span>
                <Button variant="outline" size="sm" >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
                  <Card className={` w-[19%] ${false ? "ring-2 ring-primary" : ""} ${true ? "opacity-75" : ""}`} >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-base">AFASDFDSAFS</h4>
                          <p className="text-sm text-muted-foreground">
                            afdsasdfadsffda
                          </p>
                        </div>
                          <Badge variant="default" className="text-xs">
                            Today
                          </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="text-center py-6">
                          <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-4">No attendance recorded</p>
                          <Button size="sm" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Take Attendance
                          </Button>
                        </div>
                    </CardContent>
                  </Card>
            </div>
          </CardContent>
        </Card>
    
  )
}

export default WeekOverviewCards