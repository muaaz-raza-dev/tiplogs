import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useGetIndividuals } from '@/hooks/query/useIndividualQ'
import { individualListingAtom } from '@/lib/atoms/indiviudals.atom'
import { Badge } from '@/shadcn/components/ui/badge'
import { Button } from '@/shadcn/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shadcn/components/ui/table'
import { useAtomValue } from 'jotai'
import { Mail, MoreHorizontal, Phone } from 'lucide-react'
import React, { useEffect } from 'react'

function IndividualListing() {
    const {mutate ,isPending} = useGetIndividuals() 
    const state = useAtomValue(individualListingAtom)
    useEffect(() => {
    mutate({count:0 , group:"",q:""})
    }, [])

    
  return (
    <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className=" py-3 px-4">GRNO</TableHead>
                  <TableHead className=" py-3 px-4">Name </TableHead>
                  <TableHead className=" py-3 px-4">Group</TableHead>
                  <TableHead className=" py-3 px-4">Contacts</TableHead>
                  <TableHead className=" py-3 px-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                
                {
                    isPending ? <ServerRequestLoader/>
                      : 
                      
                  state.results?.[state.count]?.map(student=>(
                          <TableRow key={student.id}>

                      <TableCell className="py-3 px-4 text-muted-foreground">{student.grno}</TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="font-medium">{student.full_name}  {student.father_name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <Badge variant="secondary">{student.group}</Badge>
                      </TableCell>
                     
                      <TableCell className="py-3 px-4 text-right flex gap-2 items-center">
                        { 
                          student.contact &&
                          <a href={`https://wa.me/92${student.contact.split("92")[student.contact.split("92").length-1]}`} target='_blank' >
                        <Button variant="ghost" size="icon">
                          <Phone className='w-4 h-4 ' />                          
                        </Button>
                          </a>
                        }
                         {
                          student.email &&
                          <a href={`https://mail.google.com/mail/u/0/?fs=1&to=${student.email}:&tf=cm`} target='_blank'  >
                        <Button variant="ghost" size="icon">
                          <Mail  className='w-4 h-4 ' />                          
                        </Button>
                        </a>
                        }
                      </TableCell>
                        <TableCell>

                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                        </TableCell>
                    </TableRow>
                  ))
                
             
                    }
                    {
                      !isPending && state.total == 0 &&
                      <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No students found matching your criteria.
                    </TableCell>
                  </TableRow>
                  }

              </TableBody>
            </Table>
  )
}



export function IndividualPagination(){
  const state = useAtomValue(individualListingAtom)
  const {mutate , isPending} = useGetIndividuals()
  const totalPages = Math.ceil(state.total / 10 )
  const currentPage = state.count +1 

  function fetchMore(to:1|-1){
      if((to==-1&& currentPage>1) || (to==1 && currentPage < totalPages)){
        mutate({count:state.count+to,group:state.filters.group,q:state.filters.q})
      }
  }
    

      return <div className="flex items-center justify-between mt-6 text-muted-foreground">
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          {
            isPending && <ServerRequestLoader/>
          }
          <div className="flex gap-2">
            <Button variant="outline" disabled={currentPage <= 1 } onClick={()=>fetchMore(-1)}>
              Previous
            </Button>
            <Button variant="outline" disabled={currentPage >= totalPages} onClick={()=>fetchMore(1)}>
              Next
            </Button>
          </div>
        </div>
}
export default IndividualListing
