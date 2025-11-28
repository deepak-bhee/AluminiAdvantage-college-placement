# Alumni Advantage – College Placement Network

A comprehensive role-based web platform connecting Students, Alumni, and Placement Administrators. This application facilitates job opportunities, mentorship, event management, and placement analytics.

## 🚀 Features

*   **Role-Based Access Control**:
    *   **Admin**: User approvals, job/event moderation, placement analytics, and final selection authority.
    *   **Alumni**: Post jobs/mentorships, host events, and recommend candidates.
    *   **Students**: Browse opportunities, apply for jobs, register for events, and build profiles.
*   **Placement Workflow**: End-to-end tracking from application to alumni recommendation to admin final selection.
*   **Event Management**: Webinars and workshop registration system.
*   **Offline-Ready Demo**: Uses a sophisticated `localStorage` mock backend, making it fully functional as a static deployment without a server.

## 🛠️ Tech Stack

*   **Framework**: React 19 + TypeScript
*   **Build Tool**: Vite 6
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Charts**: Recharts

## 💻 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Copy `.env.local.example` to `.env.local`
    *   Add your API keys (if applicable):
    ```bash
    cp .env.local.example .env.local
    ```

### Running Locally

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 📦 Building and Deployment

### Build for Production

Create a production-ready build in the `dist` folder:
```bash
npm run build
```

### Preview Production Build

Test the built application locally:
```bash
npm run preview
```

### Deploying to Vercel / Netlify

This project is optimized for static site hosting.

**Vercel:**
1.  Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2.  Import the project in Vercel.
3.  Vercel will detect Vite. Ensure the following settings:
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Environment Variables**: Go to Project Settings > Environment Variables and add `VITE_GEMINI_API_KEY` (if you are using AI features).
5.  Deploy.

**Note on Data Persistence:**
Since this project currently uses a mock backend based on `localStorage`, data is stored in the user's browser. When deployed, every user will see their own local version of the data. This allows the app to be fully interactive for demos without a dedicated database server.# AluminiAdvantage-college-placement
