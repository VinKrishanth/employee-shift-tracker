export interface Employee {
    _id: string;
    name: string;
    email: string;
  }
  
  export interface Location {
    latitude: number;
    longitude: number;
  }
  
  export interface Shift {
    employee: Employee;
    date: string;
    checkIn: string;
    checkOut?: string;
    duration: string;
    startLocation: Location;
    endLocation: Location | Record<string, never>;
    projectId: string;
    notes: string;
  }