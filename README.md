# MyChat

MyChat is a full-stack mobile chat application developed as a third-year university project. The system combines an Expo React Native mobile client with a Java Servlet backend to demonstrate practical skills in mobile application development, REST-style communication, database integration, and user-focused interface design.

The project was built to explore how a lightweight real-time messaging experience can be implemented using familiar academic and industry technologies. It supports user registration, authentication, profile display, avatar handling, contact listing, message exchange, delivery state tracking, and online/offline presence updates.

## Project Objective

The main objective of this project is to design and implement a mobile messaging platform that allows users to:

- create an account with profile details and an optional avatar
- securely sign in using a mobile number and password
- view other registered users and recent conversation summaries
- exchange one-to-one text messages
- identify delivery and seen status for messages
- observe basic user availability through online/offline status

This project was also intended to strengthen understanding of end-to-end system development, including frontend design, backend logic, persistence, and client-server integration.

## System Overview

The application is split into two major components:

- `mobile/`: Expo React Native application used by end users
- `backend/`: Java EE web application deployed as `MyChat.war`

### Mobile Application

The mobile client is responsible for:

- sign in and registration workflows
- persistent user session storage using AsyncStorage
- loading the home conversation list
- opening chat screens and sending messages
- displaying avatars or initials
- showing the user profile and logout flow

### Backend Application

The backend is responsible for:

- validating user input
- handling account registration and authentication
- storing and retrieving chat data
- managing user presence state
- updating message status
- serving uploaded avatar images
- connecting to a MySQL database through Hibernate

## Key Features

- User registration with first name, last name, mobile number, password, and optional avatar image
- User login with mobile number and password validation
- Persistent login session on the mobile app
- Home screen showing recent chat preview for each user
- One-to-one messaging interface
- Message state indicators for sent/seen flow
- User presence updates when entering or leaving the system
- Profile page with basic account details
- Avatar image support with initials fallback when no image is available

## Technology Stack

### Frontend

- React Native
- Expo
- Expo Router
- AsyncStorage
- Expo Image Picker
- Expo Font
- Shopify FlashList

### Backend

- Java Servlet / Java EE Web Application
- Hibernate ORM
- MySQL
- Gson
- Apache Ant / NetBeans project structure
- GlassFish-compatible deployment configuration

## Project Structure

```text
chat-app/
├── mobile/
│   ├── app/
│   │   ├── index.js       # Sign in screen
│   │   ├── signupf.js     # Registration step 1
│   │   ├── signupl.js     # Registration step 2
│   │   ├── home.js        # Conversation list
│   │   ├── chat.js        # Chat screen
│   │   └── profile.js     # Profile and logout
│   ├── assets/            # Images, icons, fonts
│   └── package.json
├── backend/
│   ├── src/java/controller/   # Servlet controllers
│   ├── src/java/entity/       # Hibernate entities
│   ├── src/java/model/        # Validation and Hibernate utility
│   ├── web/                   # Web resources
│   └── build.xml
└── README.md
```

## Backend Endpoints

The backend currently exposes the following servlet endpoints:

- `POST /SignUp` - register a new user with optional avatar upload
- `POST /SignIn` - authenticate an existing user
- `GET /LoadHomeData?id={userId}` - load conversation summaries for the logged-in user
- `GET /LoadChat?user_id={id}&other_user_id={id}` - load messages between two users
- `GET /SendChat?user_id={id}&other_user_id={id}&message={text}` - send a new message
- `GET /UpdateProfile?id={userId}` - update user status during logout

## Database Design Summary

Based on the current backend implementation, the system uses entity relationships around:

- `User`
- `User_Status`
- `Chat`
- `Chat_Status`

These tables support account management, user presence, message records, and message delivery status.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd chat-app
```

### 2. Configure the Backend

1. Create a MySQL database for the project, for example `my_chat`.
2. Update the Hibernate database configuration in `backend/src/java/hibernate.cfg.xml`.
3. Make sure your MySQL username, password, and database name match your local environment.
4. Deploy the backend project to a compatible Java EE server such as GlassFish.
5. Confirm the deployed application is accessible through a base URL similar to:

```text
http://localhost:8080/UrChat/
```

### 3. Configure the Mobile App

Inside `mobile/.env`, define the backend base URL:

```env
EXPO_PUBLIC_URL=http://YOUR_LOCAL_IP:8080/UrChat/
```

Important notes:

- Use your computer's local network IP address when running the app on a physical device.
- Ensure the mobile device and backend server are connected to the same network.
- Remove extra spaces around the `=` sign if you encounter environment variable loading issues.

### 4. Install Mobile Dependencies

```bash
cd mobile
npm install
```

### 5. Start the Mobile App

```bash
npm start
```

You can then open the project using:

- Expo Go on Android
- iOS simulator or device
- Android emulator

## How the Application Works

1. A user registers by entering mobile number and password, then adds personal details and an optional avatar.
2. The backend validates the input and stores user data in MySQL.
3. After signing in, the mobile client stores the authenticated user object locally.
4. The home screen periodically fetches conversation summaries from the backend.
5. The chat screen periodically loads messages and sends new ones through the servlet endpoints.
6. User presence and message status are updated by backend logic during session activity.

## Academic Value of the Project

This project demonstrates practical understanding of:

- mobile UI development using React Native
- API consumption and asynchronous communication
- Java web application development with servlets
- ORM-based database access with Hibernate
- multipart file handling for image uploads
- state management for authentication and chat data
- software integration across frontend, backend, and database layers

For a third-year university portfolio, the project shows the ability to build a complete working system rather than an isolated prototype.

## Current Limitations

- Chat updates rely on periodic polling rather than WebSockets or push-based real-time communication
- Passwords are handled in a basic form and should be improved with hashing and stronger security practices
- There is no formal automated test suite in the current repository
- Configuration values are environment-specific and need cleanup for production readiness
- Some backend actions use query parameters where `POST` would be more appropriate for production APIs

## Future Improvements

- Implement WebSocket-based real-time messaging
- Add password hashing and stronger authentication security
- Introduce JWT or token-based session management
- Add message search, deletion, and media sharing
- Improve error handling and input sanitization
- Create unit and integration tests
- Containerize the application using Docker
- Add CI/CD support for automated build and deployment

## Conclusion

MyChat is a strong academic full-stack project that demonstrates the integration of mobile development, backend engineering, and relational database management in a single application. It reflects a practical approach to building a messaging platform while also identifying clear paths for future enhancement toward production-quality software.

## Author

Third Year Undergraduate Project  
Developed for academic and portfolio purposes.
