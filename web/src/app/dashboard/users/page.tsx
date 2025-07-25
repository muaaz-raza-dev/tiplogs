"use client"

import { useState } from "react"
import { Button } from "@/shadcn/components/ui/button"
import { Input } from "@/shadcn/components/ui/input"
import { Card, CardContent } from "@/shadcn/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu"
import { Search, Filter } from "lucide-react"
import UsersTable from "./components/users_table"


export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")


 

 
  return (
      
     
<div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Role Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between min-w-[120px] bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Role: {roleFilter === "all" ? "All" : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={roleFilter} onValueChange={setRoleFilter}>
                    <DropdownMenuRadioItem value="all">All Roles</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="editor">Editor</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="viewer">Viewer</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between min-w-[120px] bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Status:{" "}
                    {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                    <DropdownMenuRadioItem value="all">All Status</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="inactive">Inactive</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
          </div>
        </CardContent>
      </Card>

      <UsersTable/>
      </div>
  )
}

