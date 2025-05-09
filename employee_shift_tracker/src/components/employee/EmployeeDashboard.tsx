// import TimeEntryList from "../TimeEntryList";
import TimeTracker from "../TimeTracker";
import WelcomeSection from "../WelcomeSection";
import ProfileTable, { TaskData } from "../../components/TaskTable";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PlusSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "@/api/authProject.js";
import { useTimeTracking } from "@/contexts/TimeTrackingContext";

export default function EmployeeDashboard() {
  const [profiles, setProfiles] = useState<TaskData[]>([]);
  const navigate = useNavigate();
  const { startWork, requestLocationPermission } = useTimeTracking();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAllProjects();
        const projects = res.projects.map((proj: any) => ({
          id: proj._id,
          taskName: proj.taskName,
          startDate: proj.startDate.split("T")[0],
          endDate: proj.endDate.split("T")[0],
          process: proj.process,
          status: proj.status,
        }));
        setProfiles(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);


  
  const onTaskStart = async (id: string) => {
    const granted = await requestLocationPermission();
    if (!granted) {
      alert("Location permission is required to start work.");
      return;
    }
  
    await startWork(id); 
  };
  

  const handleEdit = (id: string) => {
    navigate(`/employee/edit-project/${id}`);
  };

  
  return (
    <div className="sm:px-4 mt-4">
      <WelcomeSection />
      <div className=" mx-auto  px-4 py-6 space-y-6">
        <TimeTracker />
      </div>
      <div className=" mx-auto  px-4 py-6 space-y-6">
        <div className="pt-2 ">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold dark:text-white">
            Project Information
          </h2>
          <div className="flex justify-end items-center mb-4">
            <Button
              variant="outline"
              className="bg-agri-primary dark:bg-agri-secondary-dark text-white hover:text-white hover:bg-agri-primary-light px-5 py-2 rounded-xl shadow-md transition duration-200"
              onClick={() => navigate("/employee/create-project")}
            >
              <PlusSquare className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
          <ProfileTable
            data={profiles}
            onTaskStart={onTaskStart}
            onEdit={handleEdit}
          />
        </div>
        {/* <div className="grid gap-6 md:grid-cols-1">
          <TimeTracker />
        </div>
        <TimeEntryList limit={5} /> */}
      </div>
    </div>
  );
}
