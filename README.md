[![Watch the video about flight booking system](https://img.youtube.com/vi/D-2oNFvOKTw/0.jpg)](https://www.youtube.com/watch?v=D-2oNFvOKTw)

## 👥 Team Members

- **Team Leader**: Tummala Keswanth (23PA1A12M0) – IT  
- **Team Members**:  
  - Turaga Vishnu Sahithya (22PA1A05G7) – CSE  
  - Vijjana Sri Ramya (22PA1A45B9) – AI&DS  
  - Vipparthi Harsha Vardhan (23PA1A45C8) – AI&DS

---

## 🛠️ Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB (NoSQL)  
- **Platform**: MERN Stack  

---

## 🚀 Features

- 🔐 **User Authentication** (JWT-based)
- ✈️ **Flight Search & Booking**
- 💳 **Mock Payment Integration**
- 🧾 **Booking Summary**
- 🗂 **User Dashboard** (View/Cancel Bookings)
- 🧑‍💼 **Admin Panel** (Manage Flights & Bookings)
- 📊 **MongoDB Compass Support** (for real-time data visualization)

---

## 🧰 Getting Started

### 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/turagavishnusahitya/flight_booking_system.git
   cd flight_booking_system
2. Install dependencies:
   ```bash
   cd client
   npm install
   cd ../server
   npm install
4.Create a .env file inside the server folder with the following contents:
     MONGODB_URI=your_mongodb_connection_string
      WT_SECRET=your_jwt_secret_key
      Run the servers:


# Start backend
cd server
npm run server

# Start frontend
cd ../client
npm start
📊 Database Collections
users – Stores registered user data (name, email, password, etc.)

flights – Contains flight details (routes, times, prices)

bookings – Stores all user booking data and payment details

⚙️ System Modules
1. Setup Environment
Clone the repo and initialize client/server environments.

Connect MongoDB locally or via Atlas.

2. User Registration & Login
Secure login with password hashing and JWT tokens.

Credentials stored in the users collection.

3. Flight Search & Booking
Search flights by source, destination, and date.

Book flights with passenger details and preferences.

4. Mock Payment System
Card input interface (demo only).

Booking summary generated post-confirmation.

5. User Dashboard
View all bookings.

Cancel any upcoming trip.

Visual summary of spending and trips.

6. Admin Panel (Optional)
Add, remove, or edit flight details.

Monitor all bookings across the system.




