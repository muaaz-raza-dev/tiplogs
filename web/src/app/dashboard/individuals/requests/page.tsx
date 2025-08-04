"use client";

import RequestListing from "./components/request-listing";
import Searchbar from "./components/searchbar";
import SettingBar from "./components/settting-bar";

export default function StudentRegistrationPage() {
  return (
    <div className=" mx-auto ">
      <header className="mb-4 space-y-6">
        <div className="flex flex-col gap-2">
          <SettingBar />
          <Searchbar />
        </div>
      </header>
      <RequestListing />
    </div>
  );
}
