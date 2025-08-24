import AttendanceViewEachSelectbar from "./components/selectbar";
import AttendanceViewToggleFilterbar from "./components/toggle-filterbar";
import AttendanceStatsCard from "./components/attendance-stats-card";
import AttendanceTakenInfoCard from "./components/attendance-info-card";
import AttendanceIndividualsList from "./components/attendance-individuals-list";

export default function AttendancePage() {
  return (
    <div className="p-6 ">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold ">Attendance Visualization</h1>
        </div>

        <AttendanceViewEachSelectbar />
        <AttendanceViewToggleFilterbar />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AttendanceIndividualsList />
          <div className="space-y-6">
            <AttendanceStatsCard />
            <AttendanceTakenInfoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
