"use client";
import SimilarIndividualList from "./components/simillar-indivdiuals-list"
import { useGetSelfRegistrationRequestDetails } from "@/hooks/query/useIndividualQ"
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import ErrorPage from "@/components/error-page";
import RequestDetails from "./components/request-details";

export default function StudentRequestCard() {
  const {isPending,isError} = useGetSelfRegistrationRequestDetails(true)
  if (isPending){
      return <main className="flex flex-1 flex-col gap-6 items-center justify-center">
        <ServerRequestLoader size={40} stroke={5}/>
      </main>
  }
  if(isError){
    return <ErrorPage message="This page is unavailable. Please check the URL and try again." />
  }
  return (
      <main className="flex flex-1 flex-col gap-6">
        <SimilarIndividualList />
        <RequestDetails/>
 
      </main>
  
  )
}
