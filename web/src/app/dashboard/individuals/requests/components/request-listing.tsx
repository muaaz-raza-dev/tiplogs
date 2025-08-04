import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useFetchSelfRegistrationRequests } from '@/hooks/query/useIndividualQ'
import { invidualRegistrationRequestsListingAtom } from '@/lib/atoms/indiviudals.atom'
import { Button } from '@/shadcn/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table'
import {  useAtomValue } from 'jotai'
import moment from 'moment'
import Link from 'next/link'
import React, { useEffect } from 'react'

function RequestListing() {
    const state= useAtomValue(invidualRegistrationRequestsListingAtom)
    const {isPending,mutate} = useFetchSelfRegistrationRequests()
    useEffect(() => {
    mutate({count:0,q:"",status:"all"})
    }, [])
    if (isPending ) {
      <div className="border rounded-lg overflow-hidden bg-card flex items-center justify-center">
        <ServerRequestLoader size={32} stroke={5}/>
    </div>
    }
   return (
    <>
        
      <div className="border rounded overflow-hidden bg-card">
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>CNIC</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contact </TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead >Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.total > 0 ? (
              state.results[state.count].map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.full_name} - {request.father_name} </TableCell>
                  <TableCell>{request.cnic}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : request.status === "rejected" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>{request.contact}</TableCell>
                  <TableCell>{request.created_at  } ( {moment(request.created_at).format("dddd , DD  MMMM YYYY")} )</TableCell>
                  <TableCell >
                    <Link href={`requests/${request.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
        <RequestPagination/>
      </>
  )
}


export function RequestPagination(){
  const state= useAtomValue(invidualRegistrationRequestsListingAtom)
  const {isPending,mutate} = useFetchSelfRegistrationRequests()

  const totalPages = Math.ceil(state.total / 20 )
  const currentPage = state.count +1 

  function fetchMore(to:1|-1){
      if((to==-1&& currentPage>1) || (to==1 && currentPage < totalPages)){
        mutate({count:state.count+to,status:state.filters.status,q:state.filters.q})
      }
  }
    

      return <div className="flex items-center justify-between mt-6 text-muted-foreground">

        <p className='text-muted-foreground mb-2  text-sm'>Total results : {state.total} </p>
          <div className="flex gap-2 items-center">
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          {
            isPending && <ServerRequestLoader/>
          }
            <Button variant="outline" disabled={currentPage <= 1 } onClick={()=>fetchMore(-1)}>
              Previous
            </Button>
            <Button variant="outline" disabled={currentPage >= totalPages} onClick={()=>fetchMore(1)}>
              Next
            </Button>
          </div>
        </div>
}
export default RequestListing