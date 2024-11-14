# PlanetPledge 🌍

Welcome to **PlanetPledge**, a climate-focused web platform designed to drive awareness and action toward climate change. PlanetPledge includes a donation system, user profiles, an air quality index display, and features to support user engagement with climate data. This README provides an overview of the site's features, setup instructions, and technical details.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation and Setup](#installation-and-setup)
- [Firebase Database Structure](#firebase-database-structure)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Acknowledgments](#acknowledgments)

## Features

### 1. User Authentication and Profiles
- **Sign Up / Login**: Users can create an account or log in using Firebase Authentication.
- **Profile Display**: Once logged in, users can view their profile information, including their username, email, account type, total donations, membership date, and job applications.
- **Edit Profile**: Users can update their email and password, with email verification required for changes.
- **Account Deletion**: Users can delete their account after confirming through a custom popup confirmation.

### 2. Donation System
- **Track Donations**: Users can donate to the PlanetPledge cause, and their contributions are tracked in the Firebase Realtime Database. Each user can see their cumulative donations in their profile.
- **Real-Time Updates**: The donation data is dynamically fetched and displayed on the user profile page.

### 3. Air Quality Monitoring System
- **Air Quality Index (AQI)**: Displays real-time air quality data for various locations across India using data from `data.gov.in`.
- **Data Visualization**: The AQI data is displayed on an interactive map, and data is organized into a separate JSON file for efficient data management.
- **Geolocation Support**: Uses OpenWeather geocoding API to fetch latitude and longitude for accurate AQI display by location.

### 4. Climate Content and Data Visualization
- **Climate Data Visualizations**: Includes pie charts and bar graphs that provide insights into climate metrics and statistics.
- **Job Enrollment**: Users can enroll in climate-focused job opportunities, and a confirmation email is sent upon successful submission.
- **Maintenance Mode**: A styled maintenance page is available when the site is under development.

### 5. Alarm, Timer, and Stopwatch Pages
- **Real-Time Display**: Shows the current date, time, and timezone, adjusting wallpapers based on the time of day.
- **Alarm Setup**: Users can set alarms, and the system fetches real-time date and time.
- **Timer and Stopwatch**: Interactive timer and stopwatch features are available.

### 6. User-Friendly Design
- **Responsive Design**: Designed with Tailwind CSS and custom styles for a smooth, accessible user experience across devices.
- **Shimmer Loading**: Loading animations for profile data, improving user experience during data fetching.

## Tech Stack

- **Frontend**: HTML, CSS (Tailwind), JavaScript
- **Backend**: Firebase (Realtime Database and Authentication)
- **APIs**: 
  - OpenWeather Geocoding API
  - Data.gov.in (Real-time AQI)
- **Hosting**: GitHub Pages (or Firebase Hosting if applicable)

## Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/planetpledge.git
   cd planetpledge
2. **Install Dependencies** (if using Node.js for local development):
   ```cmd
   npm install
3. **Configure Firebase:**
   - Go To [Firebase Concole](firebase.google.com)
   - Set up **Firebase Realtime Database** and **Authentication**
   - Add your Firebase project configuration in `firebaseConfig` in your main JavaScipt file.
4. **Add API keys:**
   - Obtain an API key from [OpenWeather API](https://openweathermap.org/)
   - Get the AQI API key from [data.gov.in](data.gov,in)
   - Store these API keys securely.

## Firebase Database Structure
Below is a suggested structure for your Firebase Realtime Database:
```
{
  "users": {
    "uid": {
      "username": "string",
      "email": "string",
      "memberSince": "timestamp",
      "jobApplications": "number"
    }
  },
  "donations": {
    "donationId": {
      "email": "string",
      "amount": "number",
      "timestamp": "timestamp"
    }
  },
  "aqi": {
    "locationId": {
      "latitude": "number",
      "longitude": "number",
      "aqi": "number"
    }
  }
}
```
## Usage
### User Profiles
1. **Login/SignUp:** New users can register, and returning users can log in. The site fetches and displays user data post-login.
2. **Profile Updates:** Users can update their profile details, including email verification for changes.
3. **Donation Tracking:** Donations are tracked and displayed under each user's profile.

### Air Quality Index Monitoring:
1. Access AQI data on the air quality page, with real-time data and location-based accuracy using geolocation APIs.
2. View AQI across locations on an interactive map, filtered dynamically.

## Maintenance Mode
1. Activate `maintenance.html` for an engaging maintenance experience while the site is under development.

#Thank You
#Done by Narasimha 🧡
