import {  ArrowUpRightFromSquare } from "lucide-react"
import Link from "next/link"
import type * as React from "react"

interface DescriptionListProps {
  items : {
    [key:string] : string| {id:string,name:string}
  }
}

export function DescriptionList({ items }: DescriptionListProps) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
      {Object.entries(items).map((item, index) => (
        <div key={index} className="flex items-center border  rounded-md border-border gap-4 p-2">
          <dt  className=" font-medium text-muted-foreground border-r pr-4">{item[0]} </dt>
          {
            item[1]?
             typeof item[1] == "string" || typeof item[1] == "number" ? 
             <dd className="  font-medium text-foreground">{item[1] }</dd> :
             <Link href={"#"} className="flex items-center gap-2">
             <dd className=" text-foreground">{item[1].name} </dd> 
             <ArrowUpRightFromSquare className="w-3 h-3"/>
             </Link> :
             <dd className=" text-foreground">-</dd> 
          }
        </div>
      ))}
    </dl>
  )
}