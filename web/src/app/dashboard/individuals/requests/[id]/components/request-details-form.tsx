import { useGetMetaRegistrationPayload } from '@/hooks/query/useIndividualQ'
import { Button } from '@/shadcn/components/ui/button'
import { Input } from '@/shadcn/components/ui/input'
import { Label } from '@/shadcn/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select'
import { Controller, useForm } from 'react-hook-form'

function RequestAcedmicDetailsForm() {
  const {data} = useGetMetaRegistrationPayload()
      const {
        register,
        handleSubmit,
        formState: { errors ,isDirty},
        reset,
        control,
      } = useForm<{grno:string,roll_no:string,doa:string,group:string}>(); 
  const onSubmit = () => {

  }
  return (
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pt-6 border-t">
          <h3 className="text-lg font-semibold">Academic Details (Admin Fillable)</h3>
          {/* Reintroducing grid for two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grno">GR No. *</Label>
              <Input {...register("grno")} id="grno" placeholder="Enter GR Number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Group * </Label>
              {
                <Controller control={control} name="group" render={({field,fieldState})=>(
                <Select >
                          <SelectTrigger  id="className" aria-describedby="className-error" className="relative w-full" >
                            <SelectValue placeholder="Select current group" />
                          </SelectTrigger>
                          <SelectContent>
                             {  data?.payload.groups.map((e) => (
                              <SelectItem value={e.id} key={e.id}>
                                {e.name}
                              </SelectItem> 
                            ))}
                          </SelectContent>
                </Select>
                )

                } />
              }
              
            </div>

            <div className="space-y-2">
              <Label htmlFor="roll_no">Roll No. </Label>
              <Input {...register("roll_no")} id="roll_no" placeholder="Enter Roll Number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_admission">Date of Admission</Label>
              <Input {...register("doa")}  id="date_of_admission" type="date" />
            </div>
            
          </div>
            <div className="flex justify-end gap-4">
          <Button variant="outline">Reject Request</Button>
          <Button>Approve Request</Button>
        </div>
        </form>

  )
}

export default RequestAcedmicDetailsForm