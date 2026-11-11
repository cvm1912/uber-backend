# monolithic-starter

A production-ready Node.js monolithic starter application built with Express, MongoDB (Mongoose), and a layered architecture. Comes pre-wired with logging, CORS, environment config, real-time support via Socket.IO, Redis, and a structured error-handling system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (CommonJS) |
| Framework | Express v5 |
| Database | MongoDB via Mongoose |
| Cache / PubSub | Redis |
| Real-time | Socket.IO |
| Logging | Winston + Daily Rotate File |
| Auth helpers | bcryptjs |
| Config | dotenv |
| Dev server | nodemon |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/cvm1912/monolithic-starter.git
cd monolithic-starter
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
PORT=8080
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>
```

### 3. Start the server

```bash
# Development (auto-restart on file changes)
npx nodemon server.js

# Production
node server.js
```

The server starts at `http://localhost:8080` (or the port set in `.env`).

---

## API Endpoints

### General

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/` | Home — returns a welcome message | `{ success: true, message: "Welcome to Uber Backend API" }` |
| GET | `/api/ping` | Health check ping | `{ success: true, message: "pong" }` |

### Rider Routes

Registration is a multi-step flow. Each step must be completed in order.

| Step | Method | Path | Description |
|------|--------|------|-------------|
| 1 | POST | `/api/users/send-otp` | User enters country code (e.g. `+91`) and phone number — OTP is sent |
| 2 | POST | `/api/users/verify-otp` | User submits OTP — sets `isPhoneVerified = true` on success |
| 3 | POST | `/api/users/complete-profile` | User provides first name, last name, and 18+ confirmation |
| 4 | PATCH | `/api/users/profile` | User optionally adds profile picture, gender, email, and language |

---

## Project Structure

```
monolithic-starter/
├── src/
│   ├── configs/
│   │   ├── dbConfig.js          # Mongoose connection setup
│   │   └── loggerConfig.js      # Winston logger with daily log rotation
│   ├── controllers/
│   │   └── ping-controller.js   # Request handlers
│   ├── middleware/               # Custom Express middleware (auth, error handling, etc.)
│   ├── models/                   # Mongoose schema/model definitions
│   ├── repositories/             # Data access layer
│   ├── routes/
│   │   └── ping-routes.js        # Route definitions
│   ├── services/                 # Business logic layer
│   └── utils/
│       ├── AppError.js           # Custom error classes
│       └── request-helper.js     # AsyncLocalStorage for correlation IDs
├── logs/                         # Auto-generated daily log files
├── .env                          # Environment variables (not committed)
├── .gitignore
├── package.json
├── README.md
└── server.js                     # App entry point
```

---

## Data Models

### User Model

| Field | Type | Required | Default | Purpose |
|---|---|---|---|---|
| `countryCode` | String | Yes | — | Country dialing code |
| `phone` | String | Yes | — | Phone number |
| `isPhoneVerified` | Boolean | No | `false` | OTP verification status |
| `firstName` | String | No | `null` | First name (2–50 chars) |
| `lastName` | String | No | `null` | Last name (max 50 chars) |
| `isAdult` | Boolean | No | `null` | Age confirmation |
| `profilePicture` | String | No | `null` | Profile picture URL |
| `gender` | String | No | `null` | `male`, `female`, or `other` |
| `email` | String | No | `null` | Email address (lowercase) |
| `language` | String | No | `"en"` | Preferred language |
| `isProfileCompleted` | Boolean | No | `false` | Profile completion status |
| `isActive` | Boolean | No | `true` | Account active/inactive |
| `createdAt` | Date | Auto | — | Account creation date |
| `updatedAt` | Date | Auto | — | Last update |


### Driver Model

| Field | Type | Purpose |
|---|---|---|
| `name` | String | Driver's full name |
| `email` | String | Login email |
| `password` | String | Hashed password |
| `phone` | String | Contact number |
| `profileImage` | String | Profile picture |
| `isEmailVerified` | Boolean | Email verification |
| `isPhoneVerified` | Boolean | Phone verification |
| `isActive` | Boolean | Account status |
| `isApproved` | Boolean | Admin approval |
| `vehicle` | ObjectId | Reference to vehicle |
| `licenseNumber` | String | Driving licence number |
| `createdAt` | Date | Account creation |
| `updatedAt` | Date | Last update |

---

## Error Handling

Custom error classes are defined in `src/utils/AppError.js`:

| Class | Status | Use Case |
|---|---|---|
| `AppError` | any | Base error class |
| `NotFoundError` | 404 | Resource not found |
| `ValidationError` | 400 | Invalid input |
| `UnauthorizedError` | 401 | Auth failures |
| `InternalServerError` | 500 | Unexpected server errors |

---

## Logging

Logs are written to the console and to `logs/application-YYYY-MM-DD-HH.log` via Winston with daily rotation.

- Max file size: 20 MB
- Retention: 14 days
- Format: JSON with timestamp and correlation ID

Correlation IDs are tracked per-request using Node's `AsyncLocalStorage`, making it easy to trace a single request across log lines.

---

## License

ISC
