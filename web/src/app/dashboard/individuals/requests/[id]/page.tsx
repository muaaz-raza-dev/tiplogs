import SimilarIndividualList from "./components/simillar-indivdiuals-list"
import RequestDetailsForm from "./components/request-details-form"
import { Button } from "@/shadcn/components/ui/button"

export default function StudentRequestCard() {
  return (
      <main className="flex flex-1 flex-col gap-6">
        {/* Removed grid-cols-2 to stack components vertically */}
        <SimilarIndividualList />
        <RequestDetailsForm />
        <div className="flex justify-end gap-4">
          <Button variant="outline">Reject Request</Button>
          <Button>Approve Request</Button>
        </div>
      </main>
  
  )
}
