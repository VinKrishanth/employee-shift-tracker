import { useState, useEffect } from "react";
import { useTimeTracking, TimeStatus } from "@/contexts/TimeTrackingContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  PlayCircle,
  StopCircle,
  Coffee,
  Sandwich
} from "lucide-react";
import { format, differenceInSeconds } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TimeTracker: React.FC = () => {
  const {
    currentStatus,
    currentEntry,
    currentLocation,
    pauseWork,
    resumeWork,
    endWork,
    requestLocationPermission,
    locationPermissionGranted,
  } = useTimeTracking();

  const [timeElapsed, setTimeElapsed] = useState<string>("00:00:00");
  const [endWorkDialogOpen, setEndWorkDialogOpen] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");

  // Request location permission on component mount
  useEffect(() => {
    if (!locationPermissionGranted) {
      requestLocationPermission();
    }
  }, [locationPermissionGranted, requestLocationPermission]);

  // Update elapsed time display
  useEffect(() => {
    if (currentStatus === "idle" || !currentEntry) {
      setTimeElapsed("00:00:00");
      return;
    }

    // Start the timer
    const timer = setInterval(() => {
      if (!currentEntry) return;

      let totalElapsedSeconds = 0;
      const now = new Date();
      const startTime = new Date(currentEntry.startTime);

      // Calculate total duration
      totalElapsedSeconds = differenceInSeconds(now, startTime);

      // Subtract break durations
      currentEntry.breaks.forEach((breakItem) => {
        const breakStart = new Date(breakItem.startTime);
        const breakEnd = breakItem.endTime ? new Date(breakItem.endTime) : now;
        const breakDuration = differenceInSeconds(breakEnd, breakStart);
        totalElapsedSeconds -= breakDuration;
      });

      // Format as HH:MM:SS
      const hours = Math.floor(totalElapsedSeconds / 3600);
      const minutes = Math.floor((totalElapsedSeconds % 3600) / 60);
      const seconds = totalElapsedSeconds % 60;

      setTimeElapsed(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEntry, currentStatus]);

  const handleEndWork = () => {
    if (currentEntry?.notes) {
      setNotes(currentEntry.notes);
    }
    setEndWorkDialogOpen(true);
  };

  const confirmEndWork = async () => {
    await endWork(notes);
    setEndWorkDialogOpen(false);
    setNotes("");
  };

  const renderStatusBadge = () => {
    switch (currentStatus) {
      case "working":
        return <Badge className="bg-green-500">Working</Badge>;
      case "break":
        return <Badge className="bg-amber-500">On Break</Badge>;
      case "idle":
      default:
        return <Badge variant="outline">Not Tracking</Badge>;
    }
  };

  // Format date string for display
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "h:mm a");
    } catch (e) {
      return "Invalid time";
    }
  };

  return (
    <>
      <Card className="w-full shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Time Tracker
            </CardTitle>
            {renderStatusBadge()}
          </div>
          <CardDescription>
            {currentStatus === "idle"
              ? "Start tracking your work hours"
              : currentStatus === "break"
              ? "Currently on break"
              : "Currently working"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentEntry && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(currentEntry.date), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="text-3xl font-bold font-mono">
                  {timeElapsed}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-muted/50 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">
                    Started at
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {formatDate(currentEntry.startTime)}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">
                    Location
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {currentEntry.startLocation
                        ? "Recorded"
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>

              {currentEntry.breaks.length > 0 && (
                <div className="mt-4">
                  <div className="font-medium mb-2">Breaks</div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {currentEntry.breaks.map((breakItem) => (
                      <div
                        key={breakItem._id}
                        className="flex justify-between text-sm p-2 bg-muted/30 rounded"
                      >
                        <span>
                          {formatDate(breakItem.startTime)} -{" "}
                          {breakItem.endTime
                            ? formatDate(breakItem.endTime)
                            : "Ongoing"}
                        </span>
                        <span className="text-sm capitalize cursor-pointer">{breakItem.type}</span>
                        <Badge
                          variant={breakItem.endTime ? "outline" : "secondary"}
                          className="ml-2"
                        >
                          {breakItem.endTime ? "Completed" : "Active"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentEntry.notes && (
                <div className="mt-4">
                  <div className="font-medium mb-2">Notes</div>
                  <div className="p-3 bg-muted/50 rounded-md text-sm">
                    {currentEntry.notes}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStatus === "idle" && !currentEntry && (
            <div className="py-6 text-center">
              <p className="text-muted-foreground mb-2">
                You are not tracking time right now
              </p>
            </div>
          )}
        </CardContent>

        {currentStatus !== "idle" && (
          <CardFooter className="flex justify-between">
            {currentStatus === "working" ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
                  <Button variant="outline" onClick={()=>{pauseWork('tea break' )}}>
                    <Coffee className="mr-2 h-5 w-5 text-primary" />
                    Tea Break
                  </Button>
                  <Button variant="outline" onClick={()=>{pauseWork('lunch break')}}>
                    <Sandwich className="mr-2 h-5 w-5 text-primary" />
                    Lunch Break
                  </Button>
                </div>
                <Button variant="destructive" onClick={handleEndWork}>
                  <StopCircle className="mr-2 h-5 w-5" />
                  End Work
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
                  <Button onClick={resumeWork} className="w-full">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Resume Work
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleEndWork}
                  className="ml-2"
                >
                  <StopCircle className="mr-2 h-5 w-5" />
                  End Work
                </Button>
              </>
            )}
          </CardFooter>
        )}
      </Card>

      {/* End Work Dialog */}
      <Dialog open={endWorkDialogOpen} onOpenChange={setEndWorkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Work Session</DialogTitle>
            <DialogDescription>
              Add a note about what you've accomplished during this work
              session.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="What did you accomplish during this session?"
              className="min-h-[120px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEndWorkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmEndWork}>End Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TimeTracker;
