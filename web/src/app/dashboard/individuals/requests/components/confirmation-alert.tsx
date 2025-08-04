import ServerRequestLoader from "@/components/loaders/server-request-loader"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shadcn/components/ui/alert-dialog"
import { Dispatch, ReactNode, SetStateAction, useState } from "react"

function ConfirmationAlert({message,callback,children,isPending,title}:{message?:string,callback:(setopen:Dispatch<SetStateAction<boolean>>)=>void,children:ReactNode,isPending:boolean,title?:string}) {
    const[open,setOpen] = useState(false)
  return (
<AlertDialog open={open} onOpenChange={o=>setOpen(o)}>
  <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{title||"Are you absolutely sure"}?</AlertDialogTitle>
      <AlertDialogDescription>
        {message || " This action cannot be undone. "
        }
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>callback(setOpen)} disabled={isPending}>
        {isPending ? <ServerRequestLoader/> : "Continue" }
        </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default ConfirmationAlert