import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export type TimeStatus = "idle" | "working" | "break";
export type LocationData = { latitude: number; longitude: number } | null;

export interface TimeEntry {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string | null;
  startLocation: LocationData;
  endLocation: LocationData;
  breaks: {
    id: string;
    startTime: string;
    endTime: string | null;
  }[];
  notes: string;
}

interface TimeTrackingContextType {
  currentStatus: TimeStatus;
  currentEntry: TimeEntry | null;
  entries: TimeEntry[];
  currentLocation: LocationData;
  locationPermissionGranted: boolean;
  startWork: () => Promise<void>;
  pauseWork: () => Promise<void>;
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
  const { user } = useAuth();
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
          const userEntries = parsedEntries.filter(
            (entry) => entry.userId === user.id
          );
          setEntries(userEntries);

          // Check for any active entries
          const activeEntry = userEntries.find((entry) => !entry.endTime);
          if (activeEntry) {
            setCurrentEntry(activeEntry);

            // Determine current status
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

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (user && entries.length > 0) {
      const storedEntries = localStorage.getItem("timeTrackEntries");
      let allEntries = [];

      if (storedEntries) {
        try {
          const parsedEntries: TimeEntry[] = JSON.parse(storedEntries);
          const otherUserEntries = parsedEntries.filter(
            (entry) => entry.userId !== user.id
          );
          allEntries = [...otherUserEntries, ...entries];
        } catch (error) {
          allEntries = entries;
        }
      } else {
        allEntries = entries;
      }

      localStorage.setItem("timeTrackEntries", JSON.stringify(allEntries));
    }
  }, [entries, user]);

  // Get current location
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
            console.error("Error getting location:", error);
            toast(`Unable to get your location: ${error.message}`);
            resolve(null);
          },
          { enableHighAccuracy: true }
        );
      } else {
        toast("Geolocation is not supported by your browser");
        resolve(null);
      }
    });
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (!navigator.geolocation) {
        toast("Geolocation is not supported by your browser");
        return false;
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
          });
        }
      );

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setCurrentLocation(locationData);
      setLocationPermissionGranted(true);

      toast("Your location will be recorded when you check in/out.");

      return true;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      toast("You need to allow location access for check-in/out tracking.");
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

  const startWork = async (): Promise<void> => {
    if (!user) {
      toast("Please log in to start tracking time");
      return;
    }

    if (currentStatus !== "idle") {
      toast("You're already tracking time. End your current session first.");
      return;
    }

    // Get location for check-in
    const location = await getCurrentLocation();

    const newEntry: TimeEntry = {
      id: "",
      userId: user.id,
      date: formatDateForEntry(),
      startTime: getCurrentTimeString(),
      endTime: null,
      startLocation: location,
      endLocation: null,
      breaks: [],
      notes: "",
    };

    setCurrentEntry(newEntry);
    setEntries((prev) => [newEntry, ...prev]);
    setCurrentStatus("working");

    toast("Your work session has begun. Don't forget to take breaks!");
  };

  const pauseWork = async (): Promise<void> => {
    if (currentStatus !== "working" || !currentEntry) {
      //   toast("Not working", "You need to start work before taking a break");
      return;
    }

    // Create a new break
    const newBreak = {
      id: "",
      startTime: getCurrentTimeString(),
      endTime: null,
    };

    const updatedEntry = {
      ...currentEntry,
      breaks: [...currentEntry.breaks, newBreak],
    };

    setCurrentEntry(updatedEntry);
    setEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
    setCurrentStatus("break");

    // toast("Break started", "Enjoy your break! Don't forget to resume when you're back.");
  };

  const resumeWork = async (): Promise<void> => {
    if (currentStatus !== "break" || !currentEntry) {
      //   toast("Not on break", "You need to start a break before resuming work");
      return;
    }

    // Find the active break and end it
    const updatedBreaks = currentEntry.breaks.map((breakItem) => {
      if (!breakItem.endTime) {
        return {
          ...breakItem,
          endTime: getCurrentTimeString(),
        };
      }
      return breakItem;
    });

    const updatedEntry = {
      ...currentEntry,
      breaks: updatedBreaks,
    };

    setCurrentEntry(updatedEntry);
    setEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
    setCurrentStatus("working");

    // toast("Work resumed", "Welcome back! Your work session has resumed.");
  };

  const endWork = async (notes: string = ""): Promise<void> => {
    if (currentStatus === "idle" || !currentEntry) {
      //   toast("Not tracking", "You need to start work before ending it");
      return;
    }

    // If currently on a break, end it first
    let updatedBreaks = currentEntry.breaks;
    if (currentStatus === "break") {
      updatedBreaks = currentEntry.breaks.map((breakItem) => {
        if (!breakItem.endTime) {
          return {
            ...breakItem,
            endTime: getCurrentTimeString(),
          };
        }
        return breakItem;
      });
    }

    // Get location for check-out
    const location = await getCurrentLocation();

    const updatedEntry = {
      ...currentEntry,
      endTime: getCurrentTimeString(),
      endLocation: location,
      breaks: updatedBreaks,
      notes: notes || currentEntry.notes,
    };

    setCurrentEntry(null);
    setEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
    setCurrentStatus("idle");

    // toast("Work session ended", "Your work session has been recorded successfully.");
  };

  const updateEntryNotes = (entryId: string, notes: string): void => {
    // Update current entry if it's the active one
    if (currentEntry && currentEntry.id === entryId) {
      setCurrentEntry({
        ...currentEntry,
        notes,
      });
    }

    // Update in entries list
    setEntries((prev) =>
      prev.map((entry) => (entry.id === entryId ? { ...entry, notes } : entry))
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
