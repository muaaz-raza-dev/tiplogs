import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/components/ui/table"
import { useGetSelfRegistrationRequestDetails } from '@/hooks/query/useIndividualQ'

function SimilarIndividualList() {
    const {data,isFetched} = useGetSelfRegistrationRequestDetails(false)
    const list = data?.payload.simillars
  
  return (
 <Card className="w-full">
      <CardHeader>
        <CardTitle>Similar Registered Individuals</CardTitle>
        <CardDescription>Individuals already registered with similar names.</CardDescription>
        
      </CardHeader>
      <CardContent>
        {isFetched && list?.length === 0 ? (
  <p className="text-muted-foreground text-sm text-center mt-4">
    We couldn't find any students with similar details.
  </p>
)
        :
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>GRNO</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>CNIC</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list?.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.grno}</TableCell>
                <TableCell>{student.full_name} - {student.father_name}</TableCell>
                <TableCell>{student.cnic}</TableCell>
                <TableCell>{student.group.name}</TableCell>
                <TableCell>{student.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    }
      </CardContent>
    </Card>
  )
}

export default SimilarIndividualList