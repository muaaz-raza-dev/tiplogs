"use client"
import ServerRequestLoader from "@/components/loaders/server-request-loader"
import {  useEditGroup } from "@/hooks/query/useGroupQ"
import { Button } from "@/shadcn/components/ui/button"
import {
Dialog,
DialogClose,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/shadcn/components/ui/dialog"
import { Input } from "@/shadcn/components/ui/input"
import { Label } from "@/shadcn/components/ui/label"
import { AxiosError } from "axios"
import React, { ReactNode, useEffect, useState } from 'react'

function EditGroupDialog({prev_name,id,children}:{prev_name:string,id:string,children:ReactNode}) { 
    const [open, setopen] = useState(false)
    const [name,setName] = useState(prev_name)
    const {mutate,isPending,isError,error}= useEditGroup(onSuccess)
    const Error = error as AxiosError<{message:string}>

    useEffect(() => {
    setName(prev_name)
    }, [prev_name])
    
    function onSuccess(){
        setopen(false)
        setName("")
    }

    function Sumbit(){
        if (prev_name != name && name) {
        mutate({name,id})
    }

        }
  return (

    <Dialog open={open} onOpenChange={(o)=>!isPending&& setopen(o)}>
      <form>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change the Group details</DialogTitle>
            <DialogDescription>
             Input the updated name of the group you want .
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" required value={name} onChange={(e)=>setName(e.target.value)}  />
            </div>

           {isError &&
             <p className="text-sm text-destructive">
                {Error.response?.data.message || "Internal server error try again"}
             </p>
            }
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
         
            <Button onClick={Sumbit} disabled={!name || isPending || name == prev_name} type="submit">
                {isPending ? <ServerRequestLoader/> : "Save"}
                </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default EditGroupDialog
