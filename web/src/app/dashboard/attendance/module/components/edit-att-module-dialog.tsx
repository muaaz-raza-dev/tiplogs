import ServerRequestLoader from "@/components/loaders/server-request-loader"
import { useEditAttModuleDetails, useUpdateGroupUserAttendanceModule } from "@/hooks/query/useAttModuleQ"
import { Button } from "@/shadcn/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
import { Textarea } from "@/shadcn/components/ui/textarea"
import { AxiosError } from "axios"
import React, { useEffect, useState } from 'react'

function EditAttModuleDialog({state,open}:{state:{name:string,description:string;id:string};open:boolean}) {
    const [Editstate,setEditState] = useState<{name:string,description:string,id:string}>(state)
    const [openDialog,setOpenDialog] = useState(open)
    const {mutate,isPending,isError,error} = useEditAttModuleDetails(OnSuccess)
    const Error = error as AxiosError<{message:string}>
    useEffect(() => {
        setOpenDialog(open)
        setEditState(state)
    }, [open,state])

    
    function OnSuccess(){
        setOpenDialog(false)
        setEditState({name:"",'description':"",id:""})
    }
    function SubmitChanges(){
        mutate(Editstate)
    }
  return (

    <Dialog open={openDialog} onOpenChange={o=>!isPending && setOpenDialog(o)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Attendance Module Details</DialogTitle>
            <DialogDescription>
              Make changes to your module here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name"  value={Editstate.name} onChange={({target:{value}})=>setEditState(e=>({...e,name:value}))} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description"  value={Editstate.description} onChange={({target:{value}})=>setEditState(e=>({...e,description:value}))} />
            </div>
          </div>
          {isError&& <p className="text-sm text-destructive">{Error?.response?.data.message || "Somthing went wrong on servers"}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button  disabled={isPending} variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={SubmitChanges} disabled={isPending||(state.name == Editstate.name && state.description == Editstate.description)} >
                {isPending ? <ServerRequestLoader/>: "Save changes"}
                </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>

  )
}

export default EditAttModuleDialog