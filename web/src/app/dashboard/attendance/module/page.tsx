"use client"
import { Input } from "@/shadcn/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shadcn/components/ui/card"
import { Button } from "@/shadcn/components/ui/button"
import { Search } from 'lucide-react'
import { useGetAttModule } from "@/hooks/query/useAttModuleQ"
import ServerRequestLoader from "@/components/loaders/server-request-loader"
import { useEffect, useState } from "react"

export default function AttendanceModulesPage() {
  const {data,isPending,isFetched} = useGetAttModule()
  const attendanceModules = data?.payload
  const [modules,setModules] = useState(attendanceModules)
  useEffect(() => {
  data&& setModules(attendanceModules)
  }, [isFetched])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          onChange={({target:{value}})=>value ? setModules(attendanceModules?.filter(e=>e.name.toLowerCase().includes(value.toLowerCase()))):setModules(attendanceModules)}
          placeholder="Search modules..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center w-full">
        
        
        {
        isFetched&& modules?.length == 0  ?
          <div className="w-full text-center py-10 text-muted-foreground">
            No attendance modules found.
      </div>
        : isPending ? 
          <div className="w-full flex items-center justify-center py-10 ">
            <ServerRequestLoader/>
        </div>
        :
        modules?.map((module,ind) => (
          <Card key={module.id} className="flex flex-col min-w-[40%]">
            <CardContent className="justify-between flex items-center">
              <div >
              <CardTitle className="text-lg">{module.name}</CardTitle>
              <CardDescription >{module.description||"No description"}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
              <Button  variant={"outline"}>Edit</Button>
              <Button variant={"outline"}>Manage users </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
