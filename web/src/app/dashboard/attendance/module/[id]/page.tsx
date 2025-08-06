'use client'

import { useState } from 'react'
import { Button } from '@/shadcn/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { Input } from '@/shadcn/components/ui/input'
import { Badge } from '@/shadcn/components/ui/badge'
import { Search, Users, Edit, Plus, Trash2, Box } from 'lucide-react'

// Mock data
const mockGroups = [
  {
    id: 1,
    name: 'Engineering Team',
    description: 'Software development team',
    assignedUsers: [
      { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Developer' },
      { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Senior Developer' },
      { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Tech Lead' }
    ]
  },
  {
    id: 2,
    name: 'Marketing Team',
    description: 'Marketing and communications',
    assignedUsers: [
      { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Marketing Manager' },
      { id: 5, name: 'Tom Brown', email: 'tom@company.com', role: 'Content Writer' }
    ]
  },
  {
    id: 3,
    name: 'Sales Team',
    description: 'Sales and business development',
    assignedUsers: [
      { id: 6, name: 'Lisa Davis', email: 'lisa@company.com', role: 'Sales Manager' },
      { id: 7, name: 'Chris Lee', email: 'chris@company.com', role: 'Sales Rep' }
    ]
  },
  {
    id: 4,
    name: 'HR Team',
    description: 'Human resources',
    assignedUsers: []
  }
]

const allUsers = [
  { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Senior Developer' },
  { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Tech Lead' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Marketing Manager' },
  { id: 5, name: 'Tom Brown', email: 'tom@company.com', role: 'Content Writer' },
  { id: 6, name: 'Lisa Davis', email: 'lisa@company.com', role: 'Sales Manager' },
  { id: 7, name: 'Chris Lee', email: 'chris@company.com', role: 'Sales Rep' },
  { id: 8, name: 'Anna Taylor', email: 'anna@company.com', role: 'Business Dev' }
]

export default function AttendanceModule() {



  return (
    <div className="">
      <div className=" mx-auto">

        {/* Search and Add Button */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
            <Input
              placeholder="Search groups..."
              className="pl-10"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Group
          </Button>
        </div>

        {/* Groups Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              Groups 89
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {mockGroups.map((group) => (
                <div key={group.id} className="p-6 ">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <Badge variant="secondary">
                          {group.assignedUsers.length} users
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{group.description}</p>
                      
                      {/* Show first few users */}
                      {group.assignedUsers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {group.assignedUsers.slice(0, 3).map((user) => (
                            <span key={user.id} className="text-sm bg-accent-foreground text-muted-foreground px-2 py-1 rounded">
                              {user.name}
                            </span>
                          ))}
                          {group.assignedUsers.length > 3 && (
                            <span className="text-sm text-gray-500">
                              +{group.assignedUsers.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">No users assigned</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

 

        {/* Empty State */}
        {
        [].length === 1 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12  mx-auto mb-4" />
            <h3 className="text-lg font-medium  mb-2">No groups found</h3>
            <p className="text-muted-foreground mb-4">
              {true ? 'No groups match your search' : 'Create your first group to get started'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Group
            </Button>
          </div>
        )
        }
      </div>
    </div>
  )
}
