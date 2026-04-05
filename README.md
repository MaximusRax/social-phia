# 🏘️ Social Phia - Neighborhood Board

A modern, location-based neighborhood assistance application. Users can post tasks they need help with, and others in their vicinity can accept and assist them. Once a job is accepted, both users can coordinate in real-time via a dedicated chat room.

## ✨ Features

- **Geospatial Job Matching:** View requests from neighbors in your local area using automatic GPS or manual coordinate entry.
- **Job Management:** Post jobs, view active requests, track your ongoing tasks, and reopen uncompleted requests.
- **Real-Time Ready Chat:** Integrated chat room for task coordination once a job is accepted.
- **Modern UI/UX:** Built with Tailwind CSS, featuring glass-morphism, responsive design, smooth animations, and intuitive empty states.
- **Secure Authentication:** User accounts powered by NextAuth.js.

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database:** MongoDB (Mongoose) with Geospatial (`2dsphere`) indexing
- **Authentication:** NextAuth.js

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
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
