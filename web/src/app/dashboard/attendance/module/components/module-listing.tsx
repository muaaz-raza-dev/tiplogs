import React, { useState } from 'react'

import { Card, CardContent, CardDescription, CardTitle } from "@/shadcn/components/ui/card"
import { Button } from "@/shadcn/components/ui/button"
import { Edit,  UserCircle } from 'lucide-react'
import { Badge } from '@/shadcn/components/ui/badge';
import clsx from 'clsx';
import EditAttModuleDialog from './edit-att-module-dialog';
import Link from 'next/link';
function ModuleListing({modules}:{modules?:{name:string,description:string,frequency:"daily"|"custom";id:string}[]}) {
    const [Editstate,setEditState] = useState<{name:string,description:string;id:string}>({"description":"",name:"",id:""})
    const [openDialog,setOpenDialog] = useState(false)
  return (
    <>
    {

        modules?.map((module) => (
            <Card key={module.id} className="flex flex-col min-w-[40%]">
            <CardContent className="justify-between flex items-center">
              <div >
              <CardTitle className="text-lg">
              <div className="flex item-center gap-2">
                {module.name} 

                
              </div>
              </CardTitle>
              <CardDescription >{module.description||"No description"}</CardDescription>
                <Badge className={clsx("rounded-md mt-2 tracking-wide",module.frequency=="daily"?"bg-green-300 ":"bg-orange-400")}>{module.frequency}</Badge>
              </div>
              <div className="flex items-center gap-2">
              <Button onClick={()=>{setOpenDialog(true);setEditState({name:module.name,description:module.description,id:module.id})}}  variant={"outline"}><Edit/>Edit</Button>
              <Link href={`module/groups/${module.id}`}>
              <Button variant={"outline"}><UserCircle/> Assign users </Button>
              </Link>
              </div>
            </CardContent>
          </Card>
        ))
    }
    <EditAttModuleDialog state={Editstate} open={openDialog} />
    </>
  )
}

export default ModuleListing