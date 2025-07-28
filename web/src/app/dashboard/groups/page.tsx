import GroupsList from "./components/groups_list"
import GroupSearch from "./components/group_search"

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

        <GroupSearch/>
        <GroupsList/>
       
      </div>
    </div>
  )
}
