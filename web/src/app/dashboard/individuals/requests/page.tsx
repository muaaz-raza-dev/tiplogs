"use client"

import { useState, useMemo } from "react"
import { Button } from "@/shadcn/components/ui/button"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shadcn/components/ui/table"
import Searchbar from "./components/searchbar"
import SettingBar from "./components/settting-bar"

// Dummy data for student registration requests
const initialRequests = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    status: "Pending",
    date: "2024-07-20",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.s@example.com",
    status: "Approved",
    date: "2024-07-19",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    status: "Rejected",
    date: "2024-07-18",
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana.p@example.com",
    status: "Pending",
    date: "2024-07-17",
  },
  {
    id: "5",
    name: "Eve Adams",
    email: "eve.a@example.com",
    status: "Pending",
    date: "2024-07-16",
  },
]

export default function StudentRegistrationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isRegistrationEnabled, setIsRegistrationEnabled] = useState(true)
  const [publicFormUrl, setPublicFormUrl] = useState("")

  const filteredRequests = useMemo(() => {
    if (!searchQuery) {
      return initialRequests
    }
    const lowerCaseQuery = searchQuery.toLowerCase()
    return initialRequests.filter(
      (request) =>
        request.name.toLowerCase().includes(lowerCaseQuery) ||
        request.email.toLowerCase().includes(lowerCaseQuery) ||
        request.status.toLowerCase().includes(lowerCaseQuery),
    )
  }, [searchQuery])

  const handleGenerateUrl = () => {
    // In a real application, this would generate a unique URL
    const generatedUrl = `${window.location.origin}/register/student-form-public-${Math.random().toString(36).substring(2, 10)}`
    setPublicFormUrl(generatedUrl)
 
  }

  

  return (
    <div className=" mx-auto ">
      <header className="mb-4 space-y-6">
        <div className="flex flex-col gap-2">

          <SettingBar/>
         <Searchbar/>
        </div>
      </header>

      {/* List of Requests */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        request.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : request.status === "Approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
