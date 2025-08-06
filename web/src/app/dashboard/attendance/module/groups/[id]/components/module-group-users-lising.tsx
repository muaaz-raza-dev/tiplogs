"use client"
import React, { useEffect, useState } from 'react'
import { Badge } from '@/shadcn/components/ui/badge'
import {  Edit,  Trash2, Box } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { Button } from '@/shadcn/components/ui/button'
import { useGetGroupPairs } from '@/hooks/query/useGroupQ'
import { useGetAttModuleGroupUsers } from '@/hooks/query/useAttModuleQ'
import { useGetUserPairs } from '@/hooks/query/useUserQ'
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
function ModuleGroupUsersLising() {
  const {data:groupsResponse,isPending:isGroupPending} = useGetGroupPairs(false)
  const [GroupPairs, setGroupPairs] = useState<{[key:string]:string}>({})
  const {data,isPending} = useGetAttModuleGroupUsers()
  
  useEffect(() => {
    const group_pairs :{[key:string]:string}= {}
    groupsResponse?.payload.forEach(e=>{
      group_pairs[e.id]=e.name
    })
    setGroupPairs(group_pairs)
  }, [groupsResponse])
  return (
      <Card className='gap-0'>
          <CardHeader className='border-b flex items-center !mb-0'>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              Groups {data?.payload.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="divide-y">
              {data?.payload?.map((e) => (
                <div key={e.group} className="py-4  ">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{GroupPairs[e.group]}</h3>
                        <Badge variant="secondary">
                          {e.users.length} user(s)
                        </Badge>
                      </div>
                      
                      {/* Show first few users */}
                      {e.users.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {e.users.map((user) => (
                            <span key={user.id} className="text-sm bg-accent-foreground text-muted-foreground px-2 py-1 rounded-md">
                              @{user.username} - {user.full_name} 
                            </span>
                          ))}

                          

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
                
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
  )
}

export default ModuleGroupUsersLising