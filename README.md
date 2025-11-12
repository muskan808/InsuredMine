# 🧾 Insurance Assessment - Node.js Project

This project was created as part of a **technical assessment** to demonstrate skills in **Node.js, MongoDB, Worker Threads, and Scheduling**.

The application handles insurance policy data upload, search, aggregation, and automated message scheduling — along with server resource monitoring.

---

## 📦 Tech Stack

- **Node.js** (Express.js)
- **MongoDB** with Mongoose ODM
- **Worker Threads** (for async CSV/XLSX uploads)
- **pidusage** (for CPU monitoring)
- **node-schedule** (for message scheduling)
- **dotenv**, **multer**, **xlsx**, **body-parser**, **cors**

---

## 🚀 Features Implemented

### **Task 1 — Data Upload and API Implementation**

| Feature | Description |
|----------|--------------|
| **1. Upload API** | `/upload` → Uploads `.csv` or `.xlsx` file and processes it using **Worker Threads**, storing records into MongoDB. |
| **2. Search API** | `/policies/search?username=<firstName>` → Fetches all policy information related to a user. |
| **3. Aggregated Policy API** | `/policies/aggregate-by-user` → Returns aggregated policy data grouped by each user. |
| **4. MongoDB Collections** | Data stored in six separate collections: `Agent`, `User`, `Account`, `Lob`, `Carrier`, `Policy`. |

---

### **Task 2 — System Monitoring and Scheduling**

| Feature | Description |
|----------|--------------|
| **1. CPU Monitoring** | Monitors Node server’s CPU utilization in real-time. If CPU > 70%, automatically restarts the worker process. |
| **2. Scheduled Message Service** | `/scheduler/schedule` → Takes `{ message, day, time }` and inserts it into DB, executing at the scheduled time. Persistent after restart. |

---

## 🧠 Architecture Overview

src/
├── db/
│ └── mongoose.js # MongoDB connection setup
├── models/ # All MongoDB Schemas
│ ├── Agent.js
│ ├── User.js
│ ├── Account.js
│ ├── Lob.js
│ ├── Carrier.js
│ ├── Policy.js
│ └── ScheduledMessage.js
├── routes/
│ ├── upload.js # File upload endpoint
│ ├── policy.js # Search & aggregation APIs
│ └── scheduler.js # Message scheduling routes
├── services/
│ └── schedulerService.js # Background scheduler handler
├── workers/
│ └── uploadWorker.js # Worker thread logic for CSV upload
├── index.js # CPU monitoring + process spawn
└── server.js # Express app setup and route mounting

yaml
Copy code

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone <your_repo_url>
cd insurance-assessment
2️⃣ Install dependencies

npm install
3️⃣ Setup .env file
env

MONGO_URI=mongodb://localhost:27017/insurance-assessment
PORT=3000
CPU_THRESHOLD=70
SAMPLE_INTERVAL_MS=5000
4️⃣ Run the app
Option 1 (with MongoDB)

node src/index.js
Option 2 (In-memory mode for quick testing)

USE_IN_MEMORY=true node src/index.js
🔍 API Reference
1. Upload CSV/XLSX
POST /upload

Form-data:
  file: <your_csv_or_xlsx_file>
Response:

{ "status": "processing" }
2. Search Policy by Username
GET /policies/search?username=<firstName>

curl "http://localhost:3000/policies/search?username=Lura"
3. Aggregate Policies by User
GET /policies/aggregate-by-user

Returns policy count and grouped data per user.

4. Schedule Message
POST /scheduler/schedule

{
  "message": "Meeting Reminder",
  "day": "2025-11-13",
  "time": "14:30"
}
Schedules the message for that exact day and time.

🧰 CPU Auto-Restart Feature
The master process continuously checks child process CPU load using pidusage.
If usage exceeds the threshold (default 70%), the child server is gracefully restarted.

You can test it by lowering the threshold:

CPU_THRESHOLD=1 node src/index.js
✅ Example Test Commands

# Upload file
curl -F "file=@data-sheet.csv" http://localhost:3000/upload

# Search policies by username
curl "http://localhost:3000/policies/search?username=Lura"

# Aggregate policy data
curl http://localhost:3000/policies/aggregate-by-user

# Schedule a message
curl -X POST http://localhost:3000/scheduler/schedule \
  -H "Content-Type: application/json" \
  -d '{"message":"Test Message","day":"2025-11-12","time":"18:00"}'
# InsuredMine
