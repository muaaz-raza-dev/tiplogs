"use client"

import { Button } from "@/shadcn/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shadcn/components/ui/card" // Added CardFooter
import Link from "next/link"

// Mock student data
const students = [
  { id: "1", name: "Alice Johnson", rollNumber: "001" },
  { id: "2", name: "Bob Smith", rollNumber: "002" },
  { id: "3", name: "Charlie Brown", rollNumber: "003" },
  { id: "4", name: "Diana Prince", rollNumber: "004" },
  { id: "5", name: "Eve Adams", rollNumber: "005" },
]

export default function StudentsListing() {
  const handleViewDetails = (studentId: string) => {
    console.log(`Viewing details for student ID: ${studentId}`)
    // In a real app, you would navigate to a student detail page
    // e.g., router.push(`/students/${studentId}`)
  }

  const handleAssignNewRollNo = (studentId: string) => {
    console.log(`Assigning new roll number for student ID: ${studentId}`)
    // In a real app, you would open a dialog or form to assign a new roll number
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Class Student Listing</CardTitle>
          <CardDescription>View and manage students in this class.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {" "}
            {/* Changed to grid layout */}
            {students.map((student) => (
              <Card key={student.id} className="flex flex-col justify-between">
                {" "}
                {/* Each student is a Card */}
                <CardHeader>
                  <CardTitle>{student.name}</CardTitle>
                  <CardDescription>Roll No: {student.rollNumber}</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  {" "}
                  <Link href={`/dashboard/individuals/${student.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(student.id)}
                    aria-label={`View full details for ${student.name}`}
                    className=""
                    >
                    View Individual Details
                  </Button>
                      </Link>
                  <Button
                    size="sm"
                    onClick={() => handleAssignNewRollNo(student.id)}
                    aria-label={`Assign new roll number for ${student.name}`}
                    className=""
                  >
                    Assign New Roll Number
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
