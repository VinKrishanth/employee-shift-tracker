import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Shift } from '../types/shift';

export const exportToCSV = (shifts: Shift[]) => {
  // Define headers for CSV
  const headers = [
    "Employee",
    "Date", 
    "Check In", 
    "Check Out", 
    "Duration", 
    "Start Location", 
    "End Location", 
    "Notes"
  ].join(',');

  // Format the data rows
  const rows = shifts.map(shift => {
    const startLoc = `${shift.startLocation.latitude},${shift.startLocation.longitude}`;
    const endLoc = ('latitude' in shift.endLocation && 'longitude' in shift.endLocation) ? 
      `${shift.endLocation.latitude},${shift.endLocation.longitude}` : 
      'Not recorded';
    
    const formattedDate = new Date(shift.date).toLocaleDateString();
    const formattedCheckIn = new Date(shift.checkIn).toLocaleTimeString();
    const formattedCheckOut = shift.checkOut ? 
      new Date(shift.checkOut).toLocaleTimeString() : 
      'Not recorded';
    
    return [
      shift.employee.name,
      formattedDate,
      formattedCheckIn,
      formattedCheckOut,
      shift.duration || 'In progress',
      startLoc,
      endLoc,
      shift.notes || 'No notes'
    ].map(value => `"${value}"`).join(',');
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows].join('\n');
  
  // Create blob and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const fileName = `shift_data_${new Date().toISOString().slice(0, 10)}.csv`;
  saveAs(blob, fileName);
};

export const exportToPDF = (shifts: Shift[]) => {
  // Initialize PDF document
  const doc = new jsPDF();
  const title = 'Shift Location Report';
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 22);
  
  // Prepare table data
  const tableBody = shifts.map(shift => {
    const startLoc = `${shift.startLocation.latitude}, ${shift.startLocation.longitude}`;
    const endLoc = ('latitude' in shift.endLocation && 'longitude' in shift.endLocation) ? 
      `${shift.endLocation.latitude}, ${shift.endLocation.longitude}` : 
      'Not recorded';
    
    const formattedDate = new Date(shift.date).toLocaleDateString();
    const formattedCheckIn = new Date(shift.checkIn).toLocaleTimeString();
    const formattedCheckOut = shift.checkOut ? 
      new Date(shift.checkOut).toLocaleTimeString() : 
      'Not recorded';
    
    return [
      shift.employee.name,
      formattedDate,
      formattedCheckIn,
      formattedCheckOut,
      shift.duration || 'In progress',
      startLoc,
      endLoc,
      shift.notes || 'No notes'
    ];
  });
  
  // Add table
  autoTable(doc, {
    head: [['Employee', 'Date', 'Check In', 'Check Out', 'Duration', 'Start Location', 'End Location', 'Notes']],
    body: tableBody,
    startY: 30,
    theme: 'grid',
    styles: { overflow: 'linebreak' },
    headStyles: { fillColor: [155, 135, 245] }, // Using the primary purple color
    columnStyles: {
      5: { cellWidth: 'auto' },
      6: { cellWidth: 'auto' }
    }
  });
  
  // Save PDF
  const fileName = `shift_location_report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};