# 🛡️ Smart Tourist Safety Monitoring & Incident Response System

A **next-generation safety platform** for tourists, powered by **AI, Blockchain, Geo-Fencing, and IoT**, designed to ensure real-time monitoring, emergency response, and secure digital identity management.

---

## 🌍 Problem Statement
Tourism is a vital industry, but ensuring visitor safety in high-risk or remote areas remains a challenge. Traditional monitoring and manual reporting methods are **slow, inefficient, and lack real-time capabilities**.  
This project provides a **smart ecosystem** to address these issues by integrating **AI anomaly detection, blockchain-based tourist IDs, and emergency communication**.

---

## 🚀 Features
### 👤 Tourist-Facing
- **Digital Tourist ID**: Blockchain-secured ID with KYC, trip details, and validity.
- **Geo-Fencing Alerts**: Warnings when entering high-risk/restricted zones.
- **SOS Panic Button**: One-tap distress signal with location sharing.
- **Multilingual Support**: 10+ Indian languages + English.
- **Fallback SMS Alerts**: Offline emergency messaging for no-internet zones.

### 🛂 Authority-Facing
- **Police/Tourism Dashboard**: Heatmaps, alerts, digital IDs, and case tracking.
- **AI Anomaly Detection**: Detect inactivity, sudden drops, or abnormal patterns.
- **Automated e-FIR**: Quick generation of missing-person cases.
- **IoT Integration**: Smart bands/tags for high-risk zones.

---

## 🏗️ System Architecture
[Tourist Mobile App] <-> [Backend Server + AI Models] <-> [Blockchain ID Service]
|
v
[Firebase Cloud Messaging]
|
---------------------------------
| |
[Tourism Dept. Dashboard] [Police Dashboard]

markdown
Copy code

---

## 🛠️ Technologies Used
- **AI / ML** – anomaly detection, safety scoring, predictive alerts  
- **Blockchain** – tamper-proof digital tourist IDs  
- **Geo-Fencing (GPS/GIS)** – real-time location alerts  
- **React Native** – cross-platform mobile app  
- **Node.js + Express** – backend services & APIs  
- **Firebase Cloud Messaging** – push notifications  
- **Twilio / SMS Gateway** – fallback offline emergency alerts  
- **IoT Devices (Optional)** – smart tags/bands for tracking  
- **MongoDB / PostgreSQL** – secure data storage  

---

## ⚙️ Environment Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/<your-org>/smart-tourist-safety.git
cd smart-tourist-safety
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
Create a .env file inside backend/:

env
Copy code
PORT=5000
MONGO_URI=your_mongo_db_connection_string
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
SMS_GATEWAY_API_KEY=your_sms_gateway_key
Place your Firebase service account file:

arduino
Copy code
backend/config/service-account.json
Run backend:

bash
Copy code
npm run dev
3️⃣ Frontend (Mobile App)
bash
Copy code
cd frontend/App
npm install
npm start
Environment file (frontend/.env):

env
Copy code
API_BASE_URL=http://localhost:5000
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_project_id
📲 Running the App
Start backend: npm run dev (inside backend/)

Start frontend: npm start (inside frontend/App/)

Use Expo/React Native to scan QR and run on Android/iOS device.

📡 How Notifications Work
Online tourists: Receive push notifications via Firebase Cloud Messaging.

Offline tourists: Automatic SMS fallback using gateway (Twilio, MSG91, etc.).

Admins/Police: Subscribed to admins topic → instant alerts.

🔐 Security & Privacy
Blockchain-based IDs: Tamper-proof identity storage.

End-to-End Encryption: Secure location and alert data.

Role-Based Access: Tourist, Police, and Tourism Dept. users separated.

🧪 Testing
Run backend tests:

bash
Copy code
cd backend
npm test
Run frontend tests:

bash
Copy code
cd frontend/App
npm test
👥 Contribution Guide
Fork repo & create feature branch (git checkout -b feature/awesome-feature)

Commit changes (git commit -m "Add awesome feature")

Push branch (git push origin feature/awesome-feature)

Open Pull Request 🚀

📈 Future Enhancements
AI chatbot for tourists (safety queries, real-time help).

Drone-based monitoring in remote terrains.

Integration with immigration/passport systems.

🏆 Impact & Benefits
Tourist Safety First: Real-time protection in critical zones.

Trust & Transparency: Blockchain ensures tamper-proof records.

Faster Response: Panic + anomaly detection = quicker interventions.

Boost Tourism Economy: Safe tourists → higher inflow → local growth.