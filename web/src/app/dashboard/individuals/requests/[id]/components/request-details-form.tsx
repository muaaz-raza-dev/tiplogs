import ServerRequestLoader from '@/components/loaders/server-request-loader'
import { useApproveSelfRegistrationRequest, useGetMetaRegistrationPayload } from '@/hooks/query/useIndividualQ'
import { Button } from '@/shadcn/components/ui/button'
import { Input } from '@/shadcn/components/ui/input'
import { Label } from '@/shadcn/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select'
import { IapproveSelfRegistrationRequestForm } from '@/types/individual.t'
import { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'

function RequestAcedmicDetailsForm() {
  const {data} = useGetMetaRegistrationPayload()
  const {mutate,isPending,isError,error} = useApproveSelfRegistrationRequest()
  const Error = error as AxiosError<{message:string}>
      const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
      } = useForm<IapproveSelfRegistrationRequestForm>(); 

  const onSubmit = (data:IapproveSelfRegistrationRequestForm) => {
    mutate(data)
  }

  return (
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 pt-6 border-t">
          <h3 className="text-lg font-semibold">Academic Details (Admin Fillable)</h3>
          {/* Reintroducing grid for two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grno">GR No. *</Label>
              <Input type='number' {...register("grno",{required:"GRNO is required"})} id="grno" placeholder="Enter GR Number" />
               {errors.grno && (
              <p className="text-xs text-red-500 mt-1">
                {errors.grno.message}
              </p>
            )}

            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Group * </Label>
              {
                <Controller control={control} rules={{required:"Select Group"}} name="group" render={({field,fieldState})=>(
                  <>
                <Select value={field.value} onValueChange={field.onChange} >
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
         
                 {fieldState.error && (
                     <p className="text-xs text-red-500 mt-1">
                  {fieldState.error.message}
                  </p> )
                  }
                  </>

                )

                } />
              }
              
            </div>

            <div className="space-y-2">
              <Label htmlFor="roll_no">Roll No</Label>
              <Input {...register("roll_no")} id="roll_no" placeholder="Enter Roll Number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_admission">Date of Admission</Label>
              <Input {...register("doa")}  id="date_of_admission" type="date" />
            </div>
            
          </div>
            <div className="flex justify-end gap-4">
                { 
                
                 isError && (
                     <p className="text-xs text-red-500 mt-1">
                  {Error?.response?.data.message || "An error occurred while approving the request."}
                </p> ) 


                }
              
          <Button disabled={isPending} variant="outline" type='button' onClick={()=>reset()}>Reset </Button>
          <Button disabled={isPending} type='submit'>
            {
              isPending ? <ServerRequestLoader/> :  'Approve Request'
            }
            </Button>
        </div>
        </form>

  )
}

export default RequestAcedmicDetailsForm