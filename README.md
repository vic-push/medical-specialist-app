# Healthcare Communication Demo

This repository contains a **prototype web application** developed as part of my **Biomedical Engineering degree coursework**.  
It simulates secure communication between healthcare professionals, modeling how different types of medical practitioners—**Primary Care Physician (MAP)** and **Specialist (ME)**—can interact through a digital platform.  

The project integrates multiple communication protocols in the backend to demonstrate flexibility and scalability for healthcare systems.  

---

## 🚀 Project Overview

- **MAP Client (Primary Care Physician)**  
  A simple web application that connects to the backend via **REST API**.  
  Simulates how a primary care doctor can send requests, share patient-related data, and consult with specialists.  

- **ME Client (Specialist)**  
  A web application that interacts with the backend using **RPC (Remote Procedure Call)**.  
  Demonstrates how specialists can handle incoming cases, respond to queries, and collaborate efficiently.  

- **Server**  
  Built in Node.js, the server integrates **three communication layers**:  
  - **REST API**: Handles requests from the MAP client.  
  - **RPC**: Enables direct interaction with the ME client.  
  - **WebSocket**: Provides real-time communication for notifications and live updates between clients.  

This combination simulates how a **digital health platform** could unify different communication methods into a seamless workflow for healthcare teams.  

---

## 📂 Project Structure

healthcare-communication-demo/
├── map-client/ # Primary Care Physician (REST)
│ ├── index.html
| ├── Imagen_fondo.jpg
│ ├── MAP.css
| ├── MAP.js
│ └── rest.js
│
├── me-client/ # Specialist (RPC)
│ ├── index.html
| ├── Imagen_fondo.jpg
| ├── ME.css
│ ├── ME.js
│ ├── rest.js
| └── rpc.js
│
└── server/ # Backend
 ├── datos.js # DB
 ├── rpc.js 
 ├── servidor_rest.js # REST API endpoints
 ├── servidor_rpc.js # RPC implementation
 ├── servidor_webSocket.js # WebSocket handlers
 └── servidor.js

 ---

## ⚙️ How It Works

1. **MAP Client** sends patient case data through the REST API.  
2. **Server** receives the data, processes it, and forwards it to the appropriate Specialist.  
3. **ME Client** responds to cases via RPC.  
4. **WebSocket** provides real-time updates so both parties stay synchronized (new cases, responses, or alerts).  

---

## 🖥️ How to Run Locally

### Prerequisites
- Node.js (v14+) installed  
- A modern browser  

### Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/<your-username>/healthcare-communication-demo.git
   cd healthcare-communication-demo
   Start the server:
2. cd server
    node server.js
3. Open the clients in your browser:
    · map-client/index.html for Primary Care Physician
    · me-client/index.html for Specialist
4. Interact with the system:
    · Submit a request as MAP (REST).
    · Respond as ME (RPC).
    · Watch real-time updates appear via WebSocket.
   
### 🧩 Technologies Used
Frontend Clients: HTML, CSS, JavaScript
Backend: Node.js
Protocols: REST, RPC, WebSocket

### 🌱 Purpose
This demo is educational and experimental.
It shows how different communication technologies can be combined in a digital health context to improve collaboration between healthcare professionals.

### 👤 Author
Victor Soriano Saura
