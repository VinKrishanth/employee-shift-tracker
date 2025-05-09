
# 🕒 Employee Shift Tracker Web Application

A full-stack web application that allows employees to log their working hours (start, break, resume, end) and track their location using browser-based GPS. Built with React.js (frontend), Node.js + Express (backend), and MongoDB (database).

---



## 📚 Project Overview

The **Employee Shift Tracker** is designed to help employees manage and track their daily work activities, break periods, and check-in/check-out geolocations. Optionally, admins can view all employee logs and export reports for tracking and payroll purposes.

---

## 🛠 Tech Stack

### Frontend:
- Vite (React.js + TypeScript)
- React Router DOM
- Context API / Redux (optional)
- Axios

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (Authentication)
- bcryptjs (Password hashing)
- Multer (Image upload, optional)
- Cloudinary (for storing images, optional)
- Nodemailer (Email notifications, optional)

### Utilities:
- HTML5 Geolocation API
- Leaflet.js or Google Maps (Map preview, optional)

---

## ✨ Features

### ✅ Core Features:
- JWT-based authentication
- Start, pause, resume, and end shift actions
- Capture geolocation on check-in/out and breaks
- Calculate total hours excluding break time
- Show current shift status and today's work summary

### 🧑‍💼 Admin (Optional Bonus):
- View all employees' shifts
- Track durations and locations
- Export logs as CSV or PDF


⚙️ Installation & Setup
1. Clone the repository
  - git clone https://github.com/your-username/employee-shift-tracker.git
  - cd employee-shift-tracker

2. Backend Setup (employee_server)
 - cd employee_server
 - npm install

 Create .env file:
- PORT=5000
-  MONGO_URI=your_mongodb_connection_string
-  JWT_SECRET=your_jwt_secret
 - EMAIL_USER=your_email@example.com
 - EMAIL_PASS=your_email_password


  Run the server:
 -   npm start dev
    
  The server will run on http://localhost:5000

  3. Frontend Setup (employee_shift_tracker)
   -    cd ../employee_shift_tracker
   -    npm install
   -    npm start

  The Vite app will run on http://localhost:8080
  
  


