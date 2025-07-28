import { Card, CardContent } from "@/shadcn/components/ui/card"
import { Badge } from "@/shadcn/components/ui/badge"
import { Button } from "@/shadcn/components/ui/button"
import { Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/components/ui/dropdown-menu"

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

function GroupsList() {
  return (
     <Card>
          <CardContent>
            <div className="space-y-4">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-medium">{classItem.name}</h3>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{classItem.studentCount} students</Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
  )
}

export default GroupsList