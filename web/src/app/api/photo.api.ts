

import axios from "axios";

export async function UploadPhotoStudentApi(file:File,id:string) {
  const formData = new FormData()
  formData.append("file", file)
  console.log(file)
  const t = sessionStorage.getItem(process.env["NEXT_PUBLIC_ACCESS_TOKEN_KEY"]||"") ;
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/general/photo/cloud/${id}`, 
    formData, 
    {
      headers:{Authorization: `Bearer ${t}`}
    }
  ); 
  return res.data
}
