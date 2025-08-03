import { Button } from "@/shadcn/components/ui/button"
import {  UserPlus } from "lucide-react"
import { ReactNode } from "react"
import Link from "next/link"

export default function Layout({children}:{children:ReactNode}) {
  return (
    <main className="w-full mx-auto p-6 space-y-6">

        <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Individuals</h1>
          <p className="text-muted-foreground">Manage and view all Individuals in your organization</p>
        </div>
        <div className="flex items-center gap-3">
        <Link href={"/dashboard/individuals/requests"}>
        <Button variant={"secondary"} className="px-6 py-3 rounded-md flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Registration Requests
        </Button>
        </Link>
        <Link href={"individuals/new"}>
          <Button className="px-6 py-3 rounded-md flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add Individual
        </Button>
        </Link>
        </div>
      </div>
     {children}
    </main>
  )
}
