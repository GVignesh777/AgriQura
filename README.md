# AgriQura AI — Farmer Query Support & Agricultural Advisory Platform 🌾🤖

> **Smart India Hackathon (SIH) Production Platform**  
> **Lead Developer & Owner:** **GVignesh** ([@GVignesh777](https://github.com/GVignesh777))  
> **Repository:** [https://github.com/GVignesh777/AgriQura](https://github.com/GVignesh777/AgriQura)

---

## 👨‍💻 Developer & Ownership Information

- **Owner & Lead Developer:** **GVignesh**
- **GitHub:** [https://github.com/GVignesh777](https://github.com/GVignesh777)
- **Role:** System Architecture, Full-Stack Development, AI Pipeline Engineering & UI/UX Design
- **Platform Initiative:** Smart India Hackathon (SIH)

---

## 🌟 About AgriQura

**AgriQura** is an intelligent, low-latency, and accessible agricultural advisory platform specifically designed to empower Indian farmers, regardless of their technological literacy.

By combining cutting-edge **Groq Llama 3 AI**, voice interaction across **11 Indian regional languages**, computer-vision-based crop disease diagnosis, real-time **Agmarknet Mandi prices**, localized weather intelligence, and personalized government scheme discovery, AgriQura ensures every farmer receives fast, reliable, and actionable agricultural guidance.

---

## ✨ Key Modules & Features

1. **🎙️ Multilingual AI Assistant (Voice + Text)**
   - Ultra-fast responses powered by Groq Llama 3 LLM.
   - Speech-to-Text and Text-to-Speech support for 11 regional languages (Telugu, Hindi, Tamil, Kannada, Marathi, Bengali, Punjabi, Gujarati, Odia, Assamese, Malayalam, and English).
   - Agricultural knowledge base fine-tuned for Indian agronomy.

2. **🍃 AI Crop Disease Screening**
   - Instant visual leaf diagnostic tool.
   - Provides organic and chemical remedies, dosage recommendations, and preventative measures.

3. **📊 Real-Time Mandi Market Intelligence**
   - Daily APMC market rates from 3,500+ agricultural market yards across India.
   - Minimum, maximum, and modal pricing with trend insights.

4. **🌦️ Weather Intelligence & Farming Alerts**
   - Accurate 7-day agro-meteorological forecasting (rainfall, humidity, wind, and temperature).
   - Proactive weather alerts for irrigation, pesticide application, and harvest scheduling.

5. **🏛️ Central & State Government Schemes**
   - Personalized subsidy matching, PM-KISAN, KCC, and crop insurance guidance.

6. **📞 Farmer Help Desk & Certified KVK Connect**
   - Seamless issue escalation to certified Krishi Vigyan Kendra (KVK) officers and agronomy experts.

---

## 🏗️ Technical Architecture

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Framer Motion + Lucide React
- **Internationalization (i18n):** `i18next` with 11 regional Indian language translations
- **3D Interactive Graphics:** Three.js + React Three Fiber / Drei
- **Port:** `3377`

### Backend
- **Runtime:** Node.js + Express
- **Database:** MongoDB Atlas + Mongoose
- **AI Engine:** Groq SDK (Llama 3 70B / 8B)
- **Security:** Helmet, Express Rate Limiting, CORS, JWT Authentication
- **Port:** `5000`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB connection URI

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will start on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:3377`.

---

## 📜 License & Copyright

© 2026 **AgriQura AI Platform**.  
Designed, developed, and owned by **GVignesh**. All rights reserved.
