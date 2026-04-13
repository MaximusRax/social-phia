# 🏘️ Social-Phia

> **Your neighborhood, connected like never before.**

Social-Phia is a modern, location-based neighborhood assistance and community-building platform. It uses secure geospatial technology to connect you exclusively with the people who live right around the corner. Whether you need a hand moving a couch, want to trade home-baked goods for dog walking, or just want to share local news, Social-Phia bridges the gap between trusted neighbors.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Geospatial-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Pusher](https://img.shields.io/badge/Pusher-Real--Time-indigo?style=for-the-badge)

---

## 📌 Important Links

| Resource | Link |
| -------- | ---- |
| **🌍 Live Website** | [https://social-phia.verce.app](#) |
| **🎥 Demo Video** | [Watch the Demo on YouTube/Vimeo Here](#) |
| **📊 Pitch Deck (PPT)** | [https://docs.google.com/presentation/d/e/2PACX-1vTwCsYQE-tdl91_WBwOXsxVZdGVtRTFe9iDsf7PPkCD1Y9tYxb53ZZoxDKu8at0XQZQ89Bq9ZLppgbV/pub?start=false&loop=false&delayms=3000](#) |

## ✨ Features

- **📍 Hyper-Local Geospatial Engine:** Connects you strictly with people in your immediate vicinity (1km, 5km, 10km radius).
- **🤝 Skill & Favor Exchange:** Post tasks you need help with, offer a reward or exchange, and let nearby neighbors step up to assist.
- **💬 Real-Time Chat Coordination:** Instantly securely chat with the neighbor who accepted your task using WebSockets (Pusher).
- **📰 Neighborhood News & Alerts:** Share general news, local events, and critical safety alerts with everyone in your grid.
- **✨ Smart Suggestions:** The platform intelligently finds direct matches between what you're offering and what your neighbors need.
- **🎨 Modern, Accessible UI:** Beautiful Material Design 3 (M3) inspired interface with a warm, custom color palette (`#F1FAEE`, `#1D3557`, `#E07A5F`, `#457B9D`, etc.).

---

## 🛠️ How It Works

1. **Join Your Grid:** Sign up and allow basic location access. Social-Phia anchors your account to your current coordinates (or manually set ones), ensuring you only see requests within a walkable or short driving distance.
2. **Post or Browse Requests:** Need a tool? Help moving a box? Post a job to the local board. You can offer cash, a return favor, or simply ask for a good deed.
3. **Connect & Complete:** Once a neighbor accepts your request, our platform opens a secure, real-time chat room to coordinate final details.

## 🚀 Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes (Serverless)
- **Database:** MongoDB (Mongoose) utilizing powerful `2dsphere` geospatial indexing
- **Authentication:** NextAuth.js (Credentials/Session management)
- **Real-Time WebSockets:** Pusher

---

## 💻 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- A MongoDB Atlas account (or local MongoDB instance)
- A Pusher account for real-time chat

### 1. Clone the repository

```bash
cd social-phia
```

### 2. Install Dependencies

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
