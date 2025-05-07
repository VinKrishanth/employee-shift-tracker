import TimeEntryList from "../TimeEntryList";
import TimeTracker from "../TimeTracker";
import WelcomeSection from "../WelcomeSection";

export default function EmployeeDashboard() {
  return (
    <div className="px-4">
      <WelcomeSection />
      <div className=" mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-1">
          <TimeTracker />
        </div>
        <TimeEntryList limit={5} />
      </div>
    </div>
  );
}
