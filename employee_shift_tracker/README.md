# Employee Shift Tracker Web Application

A full-stack web application for tracking employee working hours and locations. Built as part of a Full Stack Developer Internship task using the **MERN** stack (MongoDB, Express.js, React, Node.js).

## 🌐 Live Demo


---

## 📦 Installation


# Clone repository
cd shift-tracker-app

# Start backend
- cd server
- npm install
- npm start

# Start frontend
- cd ../client
- npm install
- npm start


## 🚀 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **APIs**: RESTful services

---

## 🎯 Objective

Enable employees to:

- Log in securely.
- Track their working shifts (start, pause, resume, end).
- Record GPS location at key shift points.
- View shift history and statistics (optional).

---

## 🔑 Features

### 1. Authentication System
- Employee login with JWT-based authentication.
- (Optional) Registration feature.

### 2. Shift Management
- **Start Shift**: Log time and geolocation.
- **Breaks**: Take lunch or short breaks.
- **Resume Shift**: Return from break.
- **End Shift**: Log check-out time and location.
- **Summary**: Display total hours worked (breaks excluded).

### 3. Location Tracking
- Geolocation capture during:
  - Check-In
  - Breaks
  - Check-Out

### 4. Employee Dashboard
- View current shift status (Working, On Break, etc.).
- Total hours worked for the day.
- (Optional) Shift history logs.

### 5. Admin Panel *(Bonus)*
- Access all employee shift logs.
- Monitor locations and durations.
- Export data to CSV or PDF.




