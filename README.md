# Future Robotics Academy - Registration System

A modern, secure web application built to manage student registrations, generate PDF receipts, and handle admin/manager accounts for Future Robotics Academy.

## 🚀 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS & shadcn/ui
* **Authentication:** NextAuth.js (Google Provider)
* **Database:** MongoDB
* **PDF Generation:** jsPDF

## ✨ Features

* **Secure Authentication:** Google OAuth login with role-based access control (Admin vs. Manager).
* **User Management:** Admins can add, edit, demote, promote, or remove staff accounts.
* **Registration Dashboard:** Search, filter (Normal/Recording), and manage student registrations.
* **Automated PDFs:** One-click PDF receipt generation complete with company branding.
* **Real-time Stats:** Dashboard overview of total revenue and course distributions.

## 🛠️ Getting Started

### 1. Prerequisites
Make sure you have Node.js installed on your machine. You will also need a MongoDB database and Google Cloud Console credentials.

### 2. Installation
Clone the repository and install the dependencies:

```bash
npm install

```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add your secret keys. **Never commit this file to GitHub.**

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth Configuration
NEXTAUTH_URL=
NEXTAUTH_URL=
SESSION_TIMEOUT_MINUTES=

# MongoDB Database
MONGODB_URI=

```

### 4. Run the Development Server

Start the local development server:

```bash
npm run dev

```
