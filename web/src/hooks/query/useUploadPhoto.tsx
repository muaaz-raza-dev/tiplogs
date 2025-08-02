import { UploadPhotoStudentApi } from '@/app/api/photo.api'
import { useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

function useUploadPhoto(update:(url:string)=>void) {
    const params = useParams()
    const id= (params.id ?? "" )as string
  return (
    useMutation({mutationFn:(file:File)=>UploadPhotoStudentApi(file,id),
        onSuccess(data) {
            toast.success("photo has been uploaded successfully")
            update(data.payload.url)
        },
        onError(){
            toast.error("Something wen wrong , try again later ")

        }
    })
  )
}

export default useUploadPhoto