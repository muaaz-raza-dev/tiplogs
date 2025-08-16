import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useScheduledCustomAttendanceBase } from '@/hooks/query/useAttQ'
import { Button } from '@/shadcn/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/components/ui/card'
import { Calendar, Trash2 } from 'lucide-react'
import moment from 'moment'
import React from 'react'

function ScheduledAttListing() {
  const {data,isPending} = useScheduledCustomAttendanceBase()
  if (isPending){
    return       <Card>
        <div className="flex items-center justify-center my-4">
          <ServerRequestLoader size={40} stroke={5}/>
        </div>
        </Card>

  }  
  return (
      <Card>
              <CardHeader>
                <CardTitle>Upcoming Attendance ({data?.payload.total})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {
                  data?.payload.total == 0 ?
                  <div className='flex items-center justify-center'><p className='text-center text-muted-foreground '>No attendance is scheduled yet. </p></div>
                  :
                  data?.payload.docs.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{moment(record.att_date).format("dddd DD-MMMM-YYYY")}</p>
                          <p className="text-sm text-muted-foreground">
                            Registered on {moment(record.created_at).format("dddd DD-MMMM-YYYY hh:mm:ss")}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
  )
}

export default ScheduledAttListing