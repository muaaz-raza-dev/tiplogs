import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/components/ui/table"

  const similarStudents = [
    { id: "S001", name: "Jane Doe", email: "jane.doe@example.com", program: "Computer Science", status: "Active" },
    { id: "S002", name: "Peter Jones", email: "peter.j@example.com", program: "Computer Science", status: "Active" },
    { id: "S003", name: "Alice Smith", email: "alice.s@example.com", program: "Data Science", status: "Inactive" },
  ]
function SimilarIndividualList() {
  return (
 <Card className="w-full">
      <CardHeader>
        <CardTitle>Similar Registered Students</CardTitle>
        <CardDescription>Students already registered with similar profiles or interests.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Program</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {similarStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.program}</TableCell>
                <TableCell>{student.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default SimilarIndividualList