"use client";

import AttendanceMarkInfoBar from "./components/attendance-mark-info-bar";
import BatchActionBar from "./components/batch-action-bar";
import AttMarkIndividualList from "./components/att-mark-individual-list";
import { useGetMarkAttMetaData } from "@/hooks/query/useMarkAttQ";
import ServerRequestLoader from "@/components/loaders/server-request-loader";
import ErrorPage from "@/components/error-page";
import AttMarkSubmit from "./components/att-mark-submit";
import BatchActionInputBar from "./components/batch-action-input-bar";
import AttStateNotifier from "./components/att-state-notifier";

export default function AttendancePage() {
  const {isPending,isError} = useGetMarkAttMetaData()
  if(isError){
    return <div className="w-full  h-full flex items-center justify-center">
      <ErrorPage message="You have entered invalid URL . Try again with valid url " />
    </div>
  }
  return (
    <main className="w-full px-4  py-6">
      {
        isPending ? 
        <div className="w-full py-8 flex items-center justify-center">
        <ServerRequestLoader size={36} stroke={5}/>
        </div>
        :
        <>
            <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
            <h1 className='font-semibold'>Mark Attendance</h1>
        </div>
      </div>
        <AttStateNotifier/>
        <AttendanceMarkInfoBar />
        <BatchActionBar />
        <AttMarkIndividualList />
        <BatchActionInputBar/>
        <AttMarkSubmit/>
        </>
      }
    </main>
  );
}

// function NoteDialog({ student }: { student:  }) {

//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button
//             variant="ghost"
//             size="icon"
//             aria-label={`Add note for ${student.name}`}
//             className="relative"
//           >
//             <FileText className="h-5 w-5 text-muted-foreground" />
//             {!!notes[student.id] && (
//               <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500" />
//             )}
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Add Note - {student.name}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-2">
//             <Label htmlFor={`note-${student.id}`}>Remarks</Label>
//             <Textarea
//               id={`note-${student.id}`}
//               placeholder="Add any remarks for this student..."
//               value={draft}
//               onChange={(e) => setDraft(e.target.value)}
//             />
//           </div>
//           <DialogFooter className="gap-2 sm:space-x-2">
//             <Button
//               variant="secondary"
//               onClick={() => {
//                 setDraft(notes[student.id] || '')
//                 setOpen(false)
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={() => {
//                 setNotes((prev) => ({ ...prev, [student.id]: draft.trim() }))
//                 setIsDirty(true)
//                 setOpen(false)
//               }}
//             >
//               Save Note
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     )
//   }
