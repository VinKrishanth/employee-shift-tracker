import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeEntry, useTimeTracking, LocationData } from "@/contexts/TimeTrackingContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapPreview from "./MapPreview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";
import { format, formatDistance, differenceInSeconds } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const TimeEntryItem: React.FC<{ 
  entry: TimeEntry; 
  showDetails?: boolean;
  onToggleDetails: () => void;
}> = ({ entry, showDetails = false, onToggleDetails }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { updateEntryNotes } = useTimeTracking();
  const [notes, setNotes] = useState(entry.notes || "");
  const [mapPreview, setMapPreview] = useState<{
    isOpen: boolean;
    location: LocationData;
    title: string;
  }>({
    isOpen: false,
    location: null,
    title: ""
  });

  // Calculate total duration
  const calculateTotalDuration = () => {
    if (!entry.endTime) return "Ongoing";

    const startTime = new Date(entry.startTime);
    const endTime = new Date(entry.endTime);
    let totalSeconds = differenceInSeconds(endTime, startTime);

    // Subtract breaks
    entry.breaks.forEach((breakItem) => {
      if (breakItem.endTime) {
        const breakStart = new Date(breakItem.startTime);
        const breakEnd = new Date(breakItem.endTime);
        totalSeconds -= differenceInSeconds(breakEnd, breakStart);
      }
    });

    // Format as HH:MM:SS
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Format date string for display
  const formatTimeDisplay = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "h:mm a");
    } catch (e) {
      return "Invalid time";
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "EEEE, MMMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  const handleSaveNotes = () => {
    updateEntryNotes(entry.id, notes);
    setIsDialogOpen(false);
  };

  const openMapPreview = (location: LocationData, title: string) => {
    if (location) {
      setMapPreview({
        isOpen: true,
        location,
        title
      });
    }
  };

  const closeMapPreview = () => {
    setMapPreview(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="mb-4">
      <div
        className="p-3 bg-white border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleDetails}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div 
              className={`w-3 h-3 rounded-full ${entry.endTime ? "bg-green-500" : "bg-amber-500 animate-pulse-slow"}`}
            />
            <div className="font-medium">
              {formatDateDisplay(entry.date)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              {calculateTotalDuration()}
            </Badge>
            {showDetails ? (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-1 p-4 bg-gray-50 rounded-lg border border-dashed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Start Time
              </div>
              <div className="font-medium">{formatTimeDisplay(entry.startTime)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="h-4 w-4" /> End Time
              </div>
              <div className="font-medium">
                {entry.endTime ? formatTimeDisplay(entry.endTime) : "Ongoing"}
              </div>
            </div>
          </div>

          {entry.breaks.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Breaks</div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {entry.breaks.map((breakItem) => (
                  <div
                    key={breakItem.id}
                    className="flex justify-between text-sm p-2 bg-white rounded border"
                  >
                    <div>
                      {formatTimeDisplay(breakItem.startTime)} -{" "}
                      {breakItem.endTime
                        ? formatTimeDisplay(breakItem.endTime)
                        : "Ongoing"}
                    </div>
                    <div className="text-gray-500">
                      {breakItem.endTime
                        ? formatDistance(
                            new Date(breakItem.endTime),
                            new Date(breakItem.startTime),
                            { includeSeconds: true }
                          )
                        : "Active break"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {entry.startLocation && (
              <div className="flex gap-2 items-start text-sm">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">Check-in Location</div>
                  <div className="text-gray-500 mb-1">
                    Latitude: {entry.startLocation.latitude.toFixed(6)}, 
                    Longitude: {entry.startLocation.longitude.toFixed(6)}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openMapPreview(entry.startLocation, "Check-in Location");
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" /> View on Map
                  </Button>
                </div>
              </div>
            )}
            
            {entry.endLocation && (
              <div className="flex gap-2 items-start text-sm">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">Check-out Location</div>
                  <div className="text-gray-500 mb-1">
                    Latitude: {entry.endLocation.latitude.toFixed(6)}, 
                    Longitude: {entry.endLocation.longitude.toFixed(6)}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openMapPreview(entry.endLocation, "Check-out Location");
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" /> View on Map
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="text-sm text-gray-500">Notes</div>
              <div className="text-sm">
                {entry.notes ? entry.notes : "No notes added"}
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsDialogOpen(true);
              }}
            >
              Edit Notes
            </Button>
          </div>
        </div>
      )}

      {/* Edit Notes Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Session Notes</DialogTitle>
            <DialogDescription>
              Add notes about what you worked on during this session.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="What did you work on during this session?"
              className="min-h-[120px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes}>Save Notes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Preview Dialog */}
      <MapPreview
        isOpen={mapPreview.isOpen}
        onClose={closeMapPreview}
        location={mapPreview.location}
        title={mapPreview.title}
      />
    </div>
  );
};

const TimeEntryList: React.FC<{ limit?: number }> = ({ limit }) => {
  const { entries } = useTimeTracking();
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  
  // Group entries by date
  const groupedEntries: Record<string, TimeEntry[]> = entries.reduce(
    (groups, entry) => {
      const date = entry.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    },
    {} as Record<string, TimeEntry[]>
  );

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedEntries).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Limit the number of entries if specified
  const limitedDates = limit ? sortedDates.slice(0, limit) : sortedDates;

  const handleToggleDetails = (entryId: string) => {
    setExpandedEntryId(expandedEntryId === entryId ? null : entryId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Recent Time Entries
        </CardTitle>
      </CardHeader>
      <CardContent>
        {limitedDates.length > 0 ? (
          limitedDates.map((date) => (
            <div key={date} className="mb-6">
              {groupedEntries[date].map((entry) => (
                <TimeEntryItem
                  key={entry.id}
                  entry={entry}
                  showDetails={expandedEntryId === entry.id}
                  onToggleDetails={() => handleToggleDetails(entry.id)}
                />
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="mx-auto h-10 w-10 mb-2 opacity-40" />
            <p>No time entries recorded yet.</p>
            <p className="text-sm">Start tracking your first work session!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeEntryList