import { Card, CardContent } from "@/shadcn/components/ui/card"
import {  Search } from "lucide-react"
import { Input } from "@/shadcn/components/ui/input"

const classes = [
  {
    id: 1,
    name: "Introduction to Web Development",
    studentCount: 124,
  },
  {
    id: 2,
    name: "Advanced React Patterns",
    studentCount: 89,
  },
  {
    id: 3,
    name: "Database Design Fundamentals",
    studentCount: 156,
  },
  {
    id: 4,
    name: "UI/UX Design Principles",
    studentCount: 203,
  },
  {
    id: 5,
    name: "Python for Data Science",
    studentCount: 178,
  },
  {
    id: 6,
    name: "Mobile App Development",
    studentCount: 92,
  },
  {
    id: 7,
    name: "Machine Learning Basics",
    studentCount: 145,
  },
  {
    id: 8,
    name: "Digital Marketing Strategy",
    studentCount: 267,
  },
]

export default function ClassesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
     

        {/* Search Bar */}
        <Card className="mb-6 w-full">
            <CardContent>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search classes..." className="pl-10" />
          </div>
            </CardContent>
        </Card>

        {/* Classes List */}
       
      </div>
    </div>
  )
}
