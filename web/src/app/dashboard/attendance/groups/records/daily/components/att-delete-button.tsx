import React from 'react'
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
import { Button } from "@/shadcn/components/ui/button"
import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useDeleteAttendanceRecord } from '@/hooks/query/useAttQ'
import { Trash } from 'lucide-react'
import moment from 'moment'

function AttDeleteButton({att_group,att_date,onDelete}:{att_group?:string,att_date?:string;onDelete?:()=>void}) {
    const [open,setOpen] = React.useState(false)
    const {mutateAsync:deleteMutate,isPending:deletePending} = useDeleteAttendanceRecord()
    async function deleteHandler(){
      await deleteMutate(att_group||"")
      onDelete?.()
      setOpen(false)
    }
  return (
     <AlertDialog open = {open} onOpenChange={(o)=>!deletePending&&setOpen(o)}>
      <AlertDialogTrigger asChild disabled={deletePending||!att_group}>
                    <Button variant={"destructive"} className="w-full" >
              {
                deletePending? <ServerRequestLoader/>:  <>
              <Trash className="mr-2 h-4 w-4"/> Delete Attendance
                </>
              }
            </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className='pb-4'>The attendance of <b className=''> {moment(att_date).format("dddd DD-MMMM-YYYY")} </b>
            </div>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteHandler} disabled={deletePending}>
            {
                deletePending? <ServerRequestLoader/>:  "Delete"
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AttDeleteButton