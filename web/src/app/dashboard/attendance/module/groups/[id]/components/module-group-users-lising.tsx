"use client"
import React, { useEffect, useState } from 'react'
import { Badge } from '@/shadcn/components/ui/badge'
import {  Edit,  Box } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { Button } from '@/shadcn/components/ui/button'
import { useGetGroupPairs } from '@/hooks/query/useGroupQ'
import { useGetAttModuleGroupUsers } from '@/hooks/query/useAttModuleQ'
import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useSetAtom } from 'jotai'
import { AttModuleGroupUserAssignmentAtom } from '@/lib/atoms/att-module.atom'
import ErrorPage from '@/components/error-page'
import clsx from 'clsx'

function ModuleGroupUsersLising() {
  const setAtomState = useSetAtom(AttModuleGroupUserAssignmentAtom)    
  const {data:groupsResponse,isPending:isGroupPending} = useGetGroupPairs(false)
  const [GroupPairs, setGroupPairs] = useState<{[key:string]:string}>({})
  const {data,isPending,isFetched,isError} = useGetAttModuleGroupUsers()
  const group_to_users = data?.payload.groups_to_users
  const module_details = data?.payload.module
  useEffect(() => {
    const group_pairs :{[key:string]:string}= {}
    groupsResponse?.payload.forEach(e=>{
      group_pairs[e.id]=e.name
    })
    setGroupPairs(group_pairs)
  }, [groupsResponse])
  if(isPending){
    return  <Card className='gap-0'>
        <div className="flex items-center justify-center">
        <ServerRequestLoader size={32} stroke={4}/>
        </div>
        </Card>
  }
  if (isError){
    return <div className="w-full">
      <ErrorPage message="The module you're looking for doesn't exist or something went wrong on our end. Please check the URL or try again later." />
    </div>
  }
  return (
      <Card className='gap-0'>
          <CardHeader className='border-b flex items-center justify-between !mb-0'>
            <div className="">

            <h1 className='font-medium text-lg'>
              Module : {module_details?.name}
            </h1>
            <p className='text-muted-foreground text-sm'>
              {module_details?.description}
            </p>
            </div>

            <div className=" flex items-center gap-2 text-sm font-medium">
              <Box className="h-4 w-4" /> { group_to_users?.length??0}  Groups 
            </div>

          </CardHeader>
          <CardContent className="">
            <div className="divide-y ">
              {
               isFetched && !group_to_users?.length   ?
              <p className='text-sm text-muted-foreground text-center py-2 '>
                No group is registered in this module
              </p>
              :

              group_to_users?.map((e) => (
                <div key={e.group} className="py-4  border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={clsx("font-semibold text-lg",isGroupPending&&"bg-primary-foreground rounded-md p-2 animate-pulse text-primary-foreground")}>{GroupPairs[e.group]}</h3>
                        <Badge variant="secondary">
                          {e.users.length} users
                        </Badge>
                      </div>
                      
                      {/* Show first few users */}
                      {e.users.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {e.users.map((user) => (
                            <span key={user.id} className="text-sm bg-primary-foreground border   text-muted-foreground px-4 py-1 rounded-md">
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
                      onClick={()=>setAtomState({selected_group:e.group,selected_users:e.users.map(e=>e.id),group_selection_disabled:true,open_dialog:true})}
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