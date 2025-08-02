"use client";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import IndividualListing, { IndividualPagination } from "./components/individual-listing";
import IndividualFilterbar from "./components/individual-filterbar";

export default function StudentsListingPage() {
  
  return (
    <div>
      <Card className="mb-4 ">
        <CardContent className="py-0">
          <IndividualFilterbar />
        </CardContent>
      </Card>

      <Card >
        <CardContent >
          <IndividualListing />
        </CardContent>
      </Card>

      <IndividualPagination />
    </div>
  );
}
