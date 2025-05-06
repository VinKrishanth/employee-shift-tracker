import { Hand } from "lucide-react";
import welPic from "../assets/welcome-thumbnail.svg";
import { useAuth } from "@/contexts/AuthContext";

export default function WelcomeSection() {
  const { user } = useAuth();

  const isEmployee = user?.role === "employee";
  const isAdmin = user?.role === "admin";

  const title = isEmployee
    ? `Hi, ${user?.name}`
    : "Welcome to Employee Shift Management";

  const description = isEmployee
    ? "Track your assigned shifts, view attendance records, and monitor your daily work schedule with ease."
    : "Manage employees, assign shifts, monitor attendance, and streamline workforce operations all in one place.";

  return (
    <div className="bg-blue-50 dark:bg-gray-800 py-10 sm:px-4 md:px-8 lg:px-12 rounded-lg mb-8 transition-colors duration-300">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            <span className="capitalize">{title} </span>
            <span className="inline-block animate-pulse text-blue-600 dark:text-yellow-300">
              <Hand className="w-6 h-6" />
            </span>
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg text-justify">
            {description}
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src={welPic}
            alt="Employee shift tracking illustration"
            className="max-w-full h-52 scale-125 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
