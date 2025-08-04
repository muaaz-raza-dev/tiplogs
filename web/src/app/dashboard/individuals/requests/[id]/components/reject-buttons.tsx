import { useRejectSelfRegistrationRequest } from '@/hooks/query/useIndividualQ'
import { Button } from '@/shadcn/components/ui/button'
import { Trash, X } from 'lucide-react'
import React, { Dispatch } from 'react'

import ConfirmationAlert from '../../components/confirmation-alert'
import { SetStateAction } from 'jotai'
function RejectButtons() {
  const {mutateAsync : mutate,isPending} = useRejectSelfRegistrationRequest()
  async function DeleteAndReject(setOpen:Dispatch<SetStateAction<boolean>>){
    await mutate(true)
    setOpen(false)
  }
  async function Reject(setOpen:Dispatch<SetStateAction<boolean>>){
    await mutate(false)
    setOpen(false)
  }
  return (
    <>
    <ConfirmationAlert callback={DeleteAndReject} isPending={isPending}  title="Reject and Permanently Delete"
  message="This action will reject the request and permanently delete the associated data. This cannot be undone.">
    <Button variant={"secondary"} className='bg-red-800'><Trash/> Reject and delete </Button>
    </ConfirmationAlert >
    <ConfirmationAlert callback={Reject} isPending={isPending}  title="Reject Request" message="Are you sure you want to reject this request? You can review it again later if needed." >
    <Button variant={"outline"} ><X/> Reject </Button>
    </ConfirmationAlert>
    </>
  )
}

export default RejectButtons