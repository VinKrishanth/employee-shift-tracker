import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocationData } from "@/contexts/TimeTrackingContext";

interface MapPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData;
  title: string;
}

const MapPreview: React.FC<MapPreviewProps> = ({ isOpen, onClose, location, title }) => {
  if (!location) return null;

  const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="h-80 w-full overflow-hidden rounded-md border">
          <iframe 
            title="Location Map"
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0} 
            src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
          />
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </div>
        <div className="mt-4 text-right">
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Open in Google Maps
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapPreview