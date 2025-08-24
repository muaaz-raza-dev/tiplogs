"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select"
import { Card, CardContent,  CardHeader } from "@/shadcn/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import { useGetAttGroupsSpecificModule, useGetAttModulesUserSpecific } from "@/hooks/query/useAttQ"
import { Button } from "@/shadcn/components/ui/button"
import ServerRequestLoader from "@/components/loaders/server-request-loader"
import { ArrowRight, Clock, List } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"




export default function GroupsPage() {
    const {data,isPending,isSuccess} = useGetAttModulesUserSpecific()
    const searchParams = useSearchParams()
    const {refetch,data:groups,isPending:isGroupFetching,isFetched} = useGetAttGroupsSpecificModule()
    const module = (searchParams.get("module") || "")as string
    const router = useRouter()
    useEffect(() => {
    if (!module&&data){
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('module', data?.payload.modules[0].id ??"")
    const newUrl = `/dashboard/attendance?${newSearchParams.toString()}`
    router.replace(newUrl)
    }
    }, [isSuccess])
  function onModuleChange(newModule: string) {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (newModule) {
      newSearchParams.set('module', newModule)
    } else {
      newSearchParams.delete('module')
    }
    const newUrl = `/dashboard/attendance?${newSearchParams.toString()}`
    router.replace(newUrl)
    refetch()
  }
  return (
    <div className="min-h-screen ">
      <div className="w-full mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold  mb-2">Attendance (Groups)</h1>
          <p className="text-muted-foreground">Discover and view groups to manage attendance of each </p>
        </div>

        {/* Module Selector */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <label htmlFor="module-select" className="text-sm font-medium text-muted-foreground">
         Attedance Module
            </label>
            <Select value={module} disabled={isPending} onValueChange={onModuleChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a module" />
              </SelectTrigger>
              <SelectContent>
                {data?.payload.modules.map((module) => (
                  <SelectItem key={module.id} value={module.id}>
                    {module.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Link href={`/dashboard/attendance/schedule`}><Button variant={"secondary"}>Schedule Custom Attendance <Clock/> </Button> </Link>
        </div>

        {/* Groups Grid */}
        {
          isGroupFetching ?
          <div className="my-4 flex items-center justify-center">
                <ServerRequestLoader size={40} stroke={5}/>
                </div> :null
}
        <div className="flex flex-wrap gap-2 ">
          {groups?.payload.groups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow cursor-pointer gap-0  justify-between flex-row w-[48%]">
              <CardHeader className=" w-full">
                  <div className="flex w-full items-center gap-2">
                      <h1 className="text-xl font-semibold ">
                        {group.name} 
                        </h1>
                    <p className="mt-1 text-sm text-muted-foreground flex gap-1">
                      ( <span className="font-medium">{group.total}</span> individuals )
                    </p>
                  </div>
                  
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-end">
                  <div className="flex gap-2 items-center">
                  <Link href={`/dashboard/attendance/groups/records/daily?group=${group.id}&module=${module}`}>
                  <Button variant={"secondary"}>Overview </Button>
                  </Link>
                  <Link href={`/dashboard/attendance/mark/${module}/${group.id}`}>
                  <Button >Take Attendance <ArrowRight/></Button>
                  </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (when no groups match filter) */}
        {isFetched && groups?.payload.groups.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium  mb-1">No groups found</h3>
            <p className="text-muted-foreground">Try selecting a different module or check back later.</p>
          </div>
        )}
      </div>
    </div>
  )
}
