import ServerRequestLoader from '@/components/loaders/server-request-loader'
import useUploadPhoto from '@/hooks/query/useUploadPhoto'
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/components/ui/avatar'
import { Button } from '@/shadcn/components/ui/button'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'

function PhotoComponent({photo,name}:{photo:string,name:string}) {
    const ref = useRef <HTMLInputElement>(null)
    const {mutate,isPending} = useUploadPhoto(onSuccess)
    const [PhotoState,setPhotoState] = useState<{sample:string,file:null|File}>({sample:photo,file:null})

    function onSuccess(url:string){
            setPhotoState({sample:url,file:null})
    }
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const maxSizeInBytes = 2 * 1024 * 1024
    if (file) {
     if (file?.size > maxSizeInBytes){
            toast.error("File size should not exceed 2MB.")
            return
    }
      const objectUrl = URL.createObjectURL(file)
      setPhotoState({file:file,sample:objectUrl})
    }
        }

    function UploadPhoto(){
        console.log(PhotoState.file)
            if (PhotoState.file){
                mutate(PhotoState.file)
            }
        }

  return (
    <>
    <div className='flex flex-col items-center gap-2'>

    <Avatar className='w-28 h-28 relative' onClick={()=>ref.current?.click()}>
        <AvatarImage src={PhotoState.sample} className='object-contain bg-background'/>
        <AvatarFallback >
            <b className='text-5xl cursor-pointer'>{name.split("")[0]}</b>
            </AvatarFallback>
            {
                isPending ? 
                <div className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2">
      
        <ServerRequestLoader size={40} stroke={6}/>
            </div> :null
            }
    </Avatar>
    {  PhotoState.file  && <Button variant={"secondary"} onClick={UploadPhoto}>Upload</Button>
    }
    </div>
            <input type='file' onChange={handleFileChange}  accept=".png,.jpg,.jpeg" hidden ref={ref} />
    </>
  )
}

export default PhotoComponent