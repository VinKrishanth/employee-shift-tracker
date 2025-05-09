import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import {
  createShift,
  endShift,
  startBreak,
  stopBreak,
} from "@/api/shiftApi.js";

export type TimeStatus = "idle" | "working" | "break";
export type LocationData = { latitude: number; longitude: number } | null;

export interface TimeEntry {
  _id: string;
  userId: string;
  projectId: string;
  date: string;
  startTime: string;
  endTime: string | null;
  startLocation: LocationData;
  endLocation: LocationData;
  breaks: {
    _id: string;
    startTime: string;
    endTime: string | null;
    type: String;
  }[];
  notes: string;
}

interface TimeTrackingContextType {
  currentStatus: TimeStatus;
  currentEntry: TimeEntry | null;
  entries: TimeEntry[];
  currentLocation: LocationData;
  locationPermissionGranted: boolean;
  startWork: (projectId: string) => Promise<void>;
  pauseWork: (breakType: string) => Promise<void>;
  resumeWork: () => Promise<void>;
  endWork: (notes?: string) => Promise<void>;
  requestLocationPermission: () => Promise<boolean>;
  updateEntryNotes: (entryId: string, notes: string) => void;
}

const TimeTrackingContext = createContext<TimeTrackingContextType | null>(null);

export const useTimeTracking = () => {
  const context = useContext(TimeTrackingContext);
  if (!context) {
    throw new Error(
      "useTimeTracking must be used within a TimeTrackingProvider"
    );
  }
  return context;
};

export const TimeTrackingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, setIsTimeTracking } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState<TimeStatus>("idle");
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);

  // Load stored entries on mount or when user changes
  useEffect(() => {
    if (user) {
      const storedEntries = localStorage.getItem("timeTrackEntries");
      if (storedEntries) {
        try {
          const parsedEntries: TimeEntry[] = JSON.parse(storedEntries);
          setIsTimeTracking(parsedEntries[0].projectId);

          const activeEntry = parsedEntries.find((entry) => !entry.endTime);
          if (activeEntry) {
            setCurrentEntry(activeEntry);
            console.log(activeEntry);
            const activeBreak = activeEntry.breaks.find(
              (breakItem) => !breakItem.endTime
            );
            if (activeBreak) {
              setCurrentStatus("break");
            } else {
              setCurrentStatus("working");
            }
          }
        } catch (error) {
          console.error("Error parsing stored time entries:", error);
        }
      }
    }
  }, [user]);

  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!locationPermissionGranted) {
        resolve(null);
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setCurrentLocation(locationData);
            resolve(locationData);
          },
          (error) => {
            toast({
              title: "Unable to get your location",
              description: `${error.message}`,
              variant: "destructive",
            });

            resolve(null);
          },
          { enableHighAccuracy: true }
        );
      } else {
        toast({
          title: "Geolocation is not supported",
          description: `Geolocation is not supported by your browser}`,
          variant: "destructive",
        });
        resolve(null);
      }
    });
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (!navigator.geolocation) {
        toast({
          title: "Geolocation is not supported",
          description: `Geolocation is not supported by your browser}`,
          variant: "destructive",
        });
        return false;
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        }
      );

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setCurrentLocation(locationData);
      setLocationPermissionGranted(true);

      return true;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      // toast("You need to allow location access for check-in/out tracking.");
      return false;
    }
  };

  const getCurrentTimeString = (): string => {
    return new Date().toISOString();
  };

  const formatDateForEntry = (): string => {
    const date = new Date();
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  const startWork = async (projectId: string): Promise<void> => {
    if (!user) {
      toast({
        title: "Login",
        description: `Please log in to start tracking time`,
        variant: "destructive",
      });
      return;
    }

    if (currentStatus !== "idle") {
      toast({
        title: "Tracking time",
        description: `You're already tracking time. End your current session first.`,
        variant: "destructive",
      });
      return;
    }
    const location = await getCurrentLocation();
    const newEntry: TimeEntry = {
      _id: "",
      userId: user.id,
      projectId: projectId,
      date: formatDateForEntry(),
      startTime: getCurrentTimeString(),
      endTime: null,
      startLocation: location,
      endLocation: null,
      breaks: [],
      notes: "",
    };
    setIsLoading(true);
    try {
      const data = await createShift(newEntry);
      if (data.success) {
        setIsTimeTracking(projectId);
        setCurrentEntry(data.shift);
        localStorage.setItem("timeTrackEntries", JSON.stringify([data.shift]));
        setCurrentStatus("working");
        toast({
          title: "Shift started successfully!",
          description: `Your shift has been successfully started.`,
        });
      }
    } catch (error) {
      console.error("Failed to start shift:", error);
      toast({
        title: "Failed to start shift:",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pauseWork = async (breakType: string): Promise<void> => {
    if (currentStatus !== "working" || !currentEntry) {
      toast({
        title: "Not working",
        description: `You need to start work before taking a break`,
        variant: "destructive",
      });
      return;
    }

    const newBreak = {
      id: currentEntry._id,
      startTime: getCurrentTimeString(),
      type: breakType,
    };

    setIsLoading(true);
    try {
      const data = await startBreak(newBreak);
      if (data.success) {
        console.log(data.shift);
        setCurrentEntry(data.shift);
        localStorage.setItem("timeTrackEntries", JSON.stringify([data.shift]));
        setCurrentStatus("break");
        toast({
          title: "Break started",
          description: `${data.message}`,
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resumeWork = async (): Promise<void> => {
    if (currentStatus !== "break" || !currentEntry) {
      toast({
        title: "Not on break",
        description: `You need to start a break before resuming work`,
        variant: "destructive",
      });
      return;
    }
  
    const shiftEndPayload = {
      id: currentEntry._id,
      endTime: new Date().toISOString(),
    };
  
    console.log(currentEntry._id);
    setIsLoading(true);
    try {
      const data = await stopBreak(shiftEndPayload);
      if (data.success && data.shift) {
        setCurrentEntry(data.shift);
        localStorage.setItem("timeTrackEntries", JSON.stringify([data.shift]));
        setCurrentStatus("working");
        toast({
          title: "Work resumed",
          description: `${data.message}`,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Could not resume work.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error.message);
      toast({
        title: "Unexpected error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const endWork = async (notes: string = ""): Promise<void> => {
    if (currentStatus === "idle" || !currentEntry) {
      toast({
        title: "Not tracking",
        description: `You're already tracking time. End your current session first.`,
        variant: "destructive",
      });
      return;
    }

    const location = await getCurrentLocation();

    const updatedEntry = {
      _id: currentEntry._id,
      endTime: getCurrentTimeString(),
      endLocation: location,
      notes: notes || currentEntry.notes,
    };

    setIsLoading(true);
    try {
      const data = await endShift(updatedEntry);
      if (data.success) {
        setCurrentEntry(null);
        setCurrentStatus("idle");
        setIsTimeTracking("");
        localStorage.removeItem("timeTrackEntries");
        toast({
          title: "Work session ended",
          description: `${data.message}`,
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const updateEntryNotes = (entryId: string, notes: string): void => {
    // Update current entry if it's the active one
    if (currentEntry && currentEntry.projectId === entryId) {
      setCurrentEntry({
        ...currentEntry,
        notes,
      });
    }

    // Update in entries list
    setEntries((prev) =>
      prev.map((entry) =>
        entry.projectId === entryId ? { ...entry, notes } : entry
      )
    );

    // toast("Notes updated", "Your entry notes have been updated.");
  };

  return (
    <TimeTrackingContext.Provider
      value={{
        currentStatus,
        currentEntry,
        entries,
        currentLocation,
        locationPermissionGranted,
        startWork,
        pauseWork,
        resumeWork,
        endWork,
        requestLocationPermission,
        updateEntryNotes,
      }}
    >
      {children}
    </TimeTrackingContext.Provider>
  );
};
