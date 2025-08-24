import { Button } from '@/shadcn/components/ui/button'
import { Card, CardContent } from '@/shadcn/components/ui/card'
import { Select ,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/shadcn/components/ui/select'
import React from 'react'

function AttendanceViewEachSelectbar() {
  return (
      <Card>
          <CardContent >
            <div className="flex gap-4 flex-wrap ">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Module</label>
                <Select defaultValue="cs101">
                  <SelectTrigger className='min-w-[250px]'>
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs101">CS101 - Programming Fundamentals</SelectItem>
                    <SelectItem value="cs102">CS102 - Data Structures</SelectItem>
                    <SelectItem value="cs103">CS103 - Algorithms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Group</label>
                <Select defaultValue="group-a">
                  <SelectTrigger className='min-w-[250px]'>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="group-a">Group A</SelectItem>
                    <SelectItem value="group-b">Group B</SelectItem>
                    <SelectItem value="group-c">Group C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <Select defaultValue="2024-03-15">
                  <SelectTrigger className='min-w-[250px]'>
                    <SelectValue placeholder="Select date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-03-15">March 15, 2024</SelectItem>
                    <SelectItem value="2024-03-14">March 14, 2024</SelectItem>
                    <SelectItem value="2024-03-13">March 13, 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>
  )
}

export default AttendanceViewEachSelectbar