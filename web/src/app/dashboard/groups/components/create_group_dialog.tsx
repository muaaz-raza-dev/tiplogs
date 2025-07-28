"use client"
import ServerRequestLoader from "@/components/loaders/server-request-loader"
import { useCreateGroup } from "@/hooks/query/useGroupQ"
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
import React, { ReactNode, useState } from 'react'

function CreateGroupDialog({children}:{children:ReactNode}) { 
    const [open, setopen] = useState(false)
    const [name,setName] = useState("")
    const {mutate,isPending,isError,error,isSuccess}= useCreateGroup(onSuccess)
    const Error = error as AxiosError<{message:string}>

    function onSuccess(){
        setopen(false)
        setName("")
    }

    function Sumbit(){
        if (name) {
                mutate(name)
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
            <DialogTitle>Create a new Group</DialogTitle>
            <DialogDescription>
             Give the name of the group you want to create
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
         
            <Button onClick={Sumbit} disabled={!name || isPending} type="submit">
                {isPending ? <ServerRequestLoader/> : "Create"}
                </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default CreateGroupDialog
