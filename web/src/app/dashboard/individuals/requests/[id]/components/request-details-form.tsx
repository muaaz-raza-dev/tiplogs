import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
function RequestDetailsForm() {
  return (
      <Card className="w-full">
      <CardHeader>
        <CardTitle>Student Registration Request</CardTitle>
        <CardDescription>Review the details of the student's registration application.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {/* Applicant Details */}
        {/* Reintroducing grid for two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="John Doe" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" defaultValue="2000-01-15" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" defaultValue="+1 (555) 123-4567" readOnly />
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="program">Program of Interest</Label>
            <Input id="program" defaultValue="Computer Science" readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">Highest Education</Label>
            <Input id="education" defaultValue="High School Diploma" readOnly />
          </div>
        </div>
    

        {/* New section for Admin-fillable Academic Details */}
        <div className="grid gap-6 pt-6 border-t">
          <h3 className="text-lg font-semibold">Academic Details (Admin Fillable)</h3>
          {/* Reintroducing grid for two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roll_no">Roll No.</Label>
              <Input id="roll_no" placeholder="Enter Roll Number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grno">GR No.</Label>
              <Input id="grno" placeholder="Enter GR Number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_of_admission">Date of Admission</Label>
              <Input id="date_of_admission" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group">Group</Label>
              <Input id="group" placeholder="Enter Group (e.g., A, B, Science)" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RequestDetailsForm