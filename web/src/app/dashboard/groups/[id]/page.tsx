"use client"

import ErrorPage from "@/components/error-page"
import ServerRequestLoader from "@/components/loaders/server-request-loader"
import { useGetGroupIndiviudals } from "@/hooks/query/useGroupQ"
import { Button } from "@/shadcn/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/shadcn/components/ui/card" // Added CardFooter
import { ArrowRight, Edit } from "lucide-react"
import Link from "next/link"


export default function StudentsListing() {
  const{data,isPending,isError,isFetched}= useGetGroupIndiviudals()
  if (isPending){
    return <div className="flex items-center justify-center w-full ">
      <ServerRequestLoader size={40} stroke={5}/>
    </div>
  }
  if(isError){
    return <ErrorPage message="Oops! We couldn't find the group. It might be missing or there's a server issue." />
  }
  const individuals = data.payload.individuals
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="border-b pb-2 mb-2 flex justify-between items-center">
            <div className="">

          <CardTitle className="text-center text-3xl ">Individuals List</CardTitle>
          <p className="text-muted-foreground  text-sm">Enrolled individuals : {individuals.length}</p>
            </div>

          <div className="">
            <h1 className=" font-bold text-3xl">{data.payload.group.name}</h1>
            <p className="text-muted-foreground   text-right text-sm">{data.payload.group.created_at}</p>
          </div>
          </div>
        </CardHeader>
        <CardContent>
          
    
            {
              isFetched ? individuals.length==0 ?
              <div className="text-center text-muted-foreground py-6">
    No individuals have registered for this class yet.
    </div>
              :
          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">  
            {individuals.map((Individual) => (
              <Card key={Individual.id} className="flex flex-col justify-between">
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                  <div className="   text-sm rounded-md p-2  flex gap-2 font-medium border w-max">
                    <div className="text-muted-foreground pr-2 border-r"> GRNO </div>
                    <div className=" font-medium px-4"> {Individual.grno} </div>
                    </div>
                    <div className="   text-sm rounded-md p-2  flex gap-2 font-medium border w-max">
                    <div className="text-muted-foreground pr-2 border-r"> Full Name  </div>
                    <div className=" font-medium px-4"> {Individual.full_name} </div>
                    </div>
                    <div className="   text-sm rounded-md p-2  flex gap-2 font-medium border w-max">
                    <div className="text-muted-foreground pr-2 border-r"> Father Name  </div>
                    <div className=" font-medium px-4"> {Individual.father_name} </div>
                    </div>
                    <div className="   text-sm rounded-md p-2  flex gap-2 font-medium border w-max">
                    <div className="text-muted-foreground pr-2 border-r"> Group Roll No  </div>
                    <div className=" font-medium px-4"> {Individual.roll_no || "-"} </div>
                    </div>
                  </div>

                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row gap-2  border-t">
                  <Button
                    size="sm"
                    aria-label={`Assign new roll number for ${Individual.full_name}`}
                    className=""
                  >
                    <Edit/> Roll Number
                  </Button>
                  <Link href={`/dashboard/individuals/${Individual.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={`View full details for ${Individual.full_name}`}
                    className=""
                    >
                     Details <ArrowRight/>
                  </Button>
                      </Link>
                </CardFooter>
              </Card>
            )) }
          </div> 
            : null 
            }
        </CardContent>
      </Card>
    </div>
  )
}
