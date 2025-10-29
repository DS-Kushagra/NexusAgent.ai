<div align="center">

#  NexusAgent.ai

### AI-Powered Interview Preparation Platform

**Master Your Next Interview with Intelligent Practice & Real-Time Feedback**

[ Live Platform](https://nexus-agent.vercel.app/) •  [ Report Bug](https://github.com/DS-Kushagra/NexusAgent.ai/issues) • [ Request Feature](https://github.com/DS-Kushagra/NexusAgent.ai/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Automation System](#-automation-system)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**NexusAgent.ai** is a cutting-edge interview preparation platform that leverages artificial intelligence to provide realistic, personalized mock interviews. Whether you're preparing for technical coding rounds or behavioral interviews, our intelligent AI agents simulate real-world scenarios, providing instant feedback and actionable insights to help you succeed.

### 🌟 Why NexusAgent.ai?

- **🎤 Real-Time Voice Interviews** - Practice with AI-powered voice agents for authentic interview experiences
- **🧠 Intelligent Feedback** - Get detailed performance analysis powered by Google's Gemini AI
- **📈 Progress Tracking** - Monitor your improvement with comprehensive analytics and streak tracking
- **� Automated Workflows** - Email reminders, PDF reports, and weekly summaries delivered automatically
- **🎯 Personalized Learning** - AI-driven interview suggestions based on your history and goals
- **💼 Industry-Specific** - Tailored questions for various tech stacks and experience levels

---

## ✨ Features

### 🎯 Core Interview System

| Feature                      | Description                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------- |
| **🤖 AI-Powered Interviews** | Realistic mock interviews using advanced AI agents that adapt to your responses   |
| **🎤 Voice Integration**     | Practice with voice-based interviews powered by Vapi AI for natural conversations |
| ** Instant Feedback**        | Receive detailed performance analysis with scores across multiple categories      |
| **🛠️ Tech Stack Specific**   | Questions tailored for React, Node.js, Python, Java, and 20+ technologies         |
| **📱 Responsive Design**     | Seamless experience across desktop, tablet, and mobile devices                    |
| **🔐 Secure Authentication** | Firebase-powered authentication with email/password support                       |

### 🤖 Automation & Intelligence

| Feature                           | Description                                                                 |
| --------------------------------- | --------------------------------------------------------------------------- |
| **📧 Smart Email Reminders**      | Automatic notifications 24 hours before scheduled interviews                |
| **📄 Professional PDF Reports**   | Auto-generated, beautifully formatted feedback reports with every interview |
| ** Weekly Performance Summaries** | Comprehensive weekly emails with progress analytics and insights            |
| **💡 AI-Powered Suggestions**     | Personalized interview recommendations based on your performance history    |
| **🔥 Streak Tracking**            | Gamified daily practice tracking with motivational notifications            |
| **⚙️ User Preferences**           | Full control over notification frequency, timing, and content               |
| **👤 Profile Management**         | Advanced settings page with editable user profile and preferences           |

### 📈 Analytics & Insights

- **Performance Trends** - Track improvement over time with visual charts
- **Category Breakdown** - Detailed scores for communication, technical skills, and problem-solving
- **Strengths & Weaknesses** - AI-identified areas of excellence and improvement opportunities
- **Historical Data** - Access all past interviews and feedback anytime
- **Comparison Metrics** - See how your performance compares week-over-week

---

## 🚀 Tech Stack


| Category            | Technologies                                     |
| ------------------- | ------------------------------------------------ |
| **Framework**       | Next.js 15.3.3 (App Router), React 19            |
| **Language**        | TypeScript 5.0                                   |
| **Styling**         | Tailwind CSS 4, Radix UI, Shadcn/ui components   |
| **Backend**         | Next.js API Routes, Firebase Admin SDK           |
| **Database**        | Firebase Firestore (NoSQL)                       |
| **Authentication**  | Firebase Auth                                    |
| **AI/ML**           | Google Generative AI (Gemini), Vapi AI for voice |
| **Email**           | Nodemailer with SMTP (Gmail, SendGrid, AWS SES)  |
| **PDF Generation**  | jsPDF, html2canvas, @react-pdf/renderer          |
| **Form Validation** | React Hook Form, Zod                             |
| **Automation**      | Vercel Cron Jobs                                 |
| **Date Handling**   | Day.js                                           |
| **Deployment**      | Vercel                                           |

---

## 🚀 Quick Start

Get up and running in 5 minutes:

```bash
# Clone the repository
git clone https://github.com/DS-Kushagra/NexusAgent.ai.git
cd NexusAgent.ai

# Install dependencies
npm install

# Set up environment variables (see Configuration section)
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start practicing! 🎉

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.x or later
- **npm** or **yarn** package manager
- **Firebase** account (free tier works)
- **Vapi AI** account for voice features
- **Google AI API** key for Gemini
- **SMTP credentials** for email automation (optional but recommended)

### Step-by-Step Setup

1. **Clone and Install**

   ```bash
   git clone https://github.com/DS-Kushagra/NexusAgent.ai.git
   cd NexusAgent.ai
   npm install
   ```

2. **Firebase Configuration**

   - Create a new project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Authentication** (Email/Password provider)
   - Create a **Firestore Database** (start in test mode)
   - Generate a service account key:
     - Go to Project Settings → Service Accounts
     - Click "Generate new private key"
     - Save the JSON file securely

3. **Vapi AI Setup**

   - Sign up at [Vapi.ai](https://vapi.ai/)
   - Get your Public and Private API keys from the dashboard
   - Create voice agents for interviewer personas

4. **Google AI (Gemini) Setup**

   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

5. **Email Automation (Optional)**

   **For Development (Gmail):**

   - Enable 2-Factor Authentication on Gmail
   - Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)

   **For Production:**

   - Use [SendGrid](https://sendgrid.com/), [AWS SES](https://aws.amazon.com/ses/), or [Mailgun](https://www.mailgun.com/)
   - See [AUTOMATION_SETUP.md](AUTOMATION_SETUP.md) for detailed instructions

6. **Environment Variables**

   Create `.env.local` in the root directory:

   ```env
   # ============================================
   # FIREBASE CONFIGURATION (Required)
   # ============================================
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123

   # Firebase Admin SDK (Server-side)
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

   # ============================================
   # VAPI AI CONFIGURATION (Required for Voice)
   # ============================================
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_live_...
   VAPI_PRIVATE_KEY=sk_live_...

   # ============================================
   # GOOGLE AI (Required for Feedback)
   # ============================================
   GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...

   # ============================================
   # APPLICATION SETTINGS
   # ============================================
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # ============================================
   # EMAIL AUTOMATION (Optional but Recommended)
   # ============================================
   # For Gmail (Development)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password

   # For Production (SendGrid example)
   # SMTP_HOST=smtp.sendgrid.net
   # SMTP_PORT=587
   # SMTP_USER=apikey
   # SMTP_PASSWORD=SG.your-sendgrid-api-key

   # ============================================
   # CRON JOB SECURITY (Required for Automation)
   # ============================================
   # Generate with: openssl rand -base64 32
   CRON_SECRET=your-random-secret-key-here
   ```

7. **Generate Cron Secret**

   ```bash
   openssl rand -base64 32
   ```

   Copy the output to `CRON_SECRET` in your `.env.local`

8. **Run the Development Server**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## ⚙️ Configuration

### Firestore Database Structure

The application uses the following Firestore collections:

```
users/
  {userId}/
    - name: string
    - email: string
    - bio: string (optional)
    - location: string (optional)
    - currentRole: string (optional)
    - targetRole: string (optional)
    - experience: string (optional)
    - createdAt: timestamp

interviews/
  {interviewId}/
    - userId: string
    - role: string
    - level: string
    - type: string
    - techstack: array
    - createdAt: timestamp

feedback/
  {feedbackId}/
    - userId: string
    - interviewId: string
    - totalScore: number
    - categoryScores: array
    - strengths: array
    - areasForImprovement: array
    - finalAssessment: string
    - createdAt: timestamp

user_preferences/
  {userId}/
    - emailNotifications: boolean
    - weeklyReports: boolean
    - streakReminders: boolean
    - interviewSuggestions: boolean
    - reminderHours: number (default: 24)

user_streaks/
  {userId}/
    - currentStreak: number
    - longestStreak: number
    - lastInterviewDate: timestamp
    - totalInterviews: number

scheduled_interviews/
  {scheduleId}/
    - userId: string
    - role: string
    - level: string
    - type: string
    - techstack: array
    - scheduledFor: timestamp
    - reminderSent: boolean
    - status: string ("pending" | "completed" | "cancelled")
```

### Security Rules

Apply these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can read/write their own interviews
    match /interviews/{interviewId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }

    // Similar rules for other collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🤖 Automation System

NexusAgent.ai features a comprehensive automation system powered by Vercel Cron Jobs and Nodemailer.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTOMATION WORKFLOW                       │
└─────────────────────────────────────────────────────────────┘

User Completes Interview
         │
         ▼
  ┌──────────────────┐
  │ Save Feedback    │──────────► Update Streak Counter
  └──────────────────┘
         │
         ▼
  ┌──────────────────┐
  │ Generate PDF     │──────────► Store in Database
  └──────────────────┘
         │
         ▼
  ┌──────────────────┐
  │ Send Email       │──────────► Feedback Ready Notification
  └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     CRON JOBS SCHEDULE                       │
└─────────────────────────────────────────────────────────────┘

Every 6 hours        → Interview Reminders (0 */6 * * *)
Daily at 9 AM UTC    → Streak Checks       (0 9 * * *)
Monday at 10 AM UTC  → Weekly Reports      (0 10 * * 1)
Wednesday at 3 PM UTC→ AI Suggestions      (0 15 * * 3)
```

### Automation Features Explained

#### 1. **Email Reminders** 📧

- **Trigger**: Scheduled interviews 24 hours in advance
- **Frequency**: Every 6 hours via cron job
- **Content**: Interview details, preparation tips, direct link to start
- **User Control**: Can disable via settings

#### 2. **Feedback PDF Reports** 📄

- **Trigger**: Automatically after interview completion
- **Format**: Professional, beautifully formatted PDF with:
  - Candidate information
  - Interview details (role, level, tech stack)
  - Overall performance score with visual indicators
  - Category-wise breakdown with progress bars
  - Strengths and improvement areas
  - Final assessment from AI
- **Delivery**: Email attachment + download link on feedback page

#### 3. **Weekly Progress Reports**

- **Trigger**: Every Monday at 10 AM UTC
- **Includes**:
  - Total interviews completed this week
  - Average performance score
  - Current practice streak
  - Category-wise performance trends
  - Top strengths identified
  - Key areas to focus on
  - Interview history with scores
- **Format**: HTML email + PDF attachment

#### 4. **AI-Powered Suggestions** 💡

- **Trigger**: Every Wednesday at 3 PM UTC
- **Analysis**: Based on:
  - Past interview performance
  - Identified weak areas
  - Rarely practiced categories
  - User's target role and experience level
- **Recommendations**: 3-5 personalized interview suggestions with:
  - Recommended role
  - Difficulty level
  - Interview type
  - Relevant tech stack
  - Reason for recommendation

#### 5. **Streak Tracking** 🔥

- **Trigger**: Daily at 9 AM UTC
- **Logic**:
  - Increment streak on daily practice
  - Send reminder if no interview in 20+ hours
  - Reset streak after 48 hours of inactivity
- **Notifications**: Motivational emails to maintain consistency

### Configuring Automation

**User Preferences** (via `/settings` page):

```typescript
{
  emailNotifications: boolean,      // Master toggle
  weeklyReports: boolean,           // Weekly summaries
  streakReminders: boolean,         // Streak notifications
  interviewSuggestions: boolean,    // AI recommendations
  reminderHours: number             // Hours before interview (1-48)
}
```

**Cron Jobs** (in `vercel.json`):

```json
{
  "crons": [
    {
      "path": "/api/cron/interview-reminders",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/daily-streak",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/weekly-reports",
      "schedule": "0 10 * * 1"
    },
    {
      "path": "/api/cron/weekly-suggestions",
      "schedule": "0 15 * * 3"
    }
  ]
}
```

**Security**: All cron endpoints are protected with Bearer token authentication using `CRON_SECRET`.

---

## 📚 API Reference

### Authentication Required Endpoints

All user-facing APIs require Firebase authentication.

#### User Profile

```http
GET  /api/user/profile
PATCH /api/user/profile
```

**Response:**

```json
{
  "success": true,
  "profile": {
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software Engineer",
    "location": "San Francisco, CA",
    "currentRole": "Senior Developer",
    "targetRole": "Tech Lead",
    "experience": "5+"
  }
}
```

#### Automation APIs

**Get User Preferences**

```http
GET /api/automation/preferences
```

**Update Preferences**

```http
PATCH /api/automation/preferences
Content-Type: application/json

{
  "emailNotifications": true,
  "weeklyReports": true,
  "streakReminders": true,
  "interviewSuggestions": true,
  "reminderHours": 24
}
```

**Get Streak Data**

```http
GET /api/automation/streak
```

**Response:**

```json
{
  "success": true,
  "streak": {
    "currentStreak": 5,
    "longestStreak": 12,
    "totalInterviews": 45,
    "lastInterviewDate": "2025-10-29T10:30:00Z"
  }
}
```

**Get AI Suggestions**

```http
GET /api/automation/suggestions
```

**Response:**

```json
{
  "success": true,
  "suggestions": [
    {
      "role": "Full Stack Developer",
      "level": "mid",
      "type": "Technical",
      "techStack": ["React", "Node.js", "MongoDB"],
      "reason": "Based on your recent performance...",
      "priority": 1
    }
  ]
}
```

**Download PDF Report**

```http
GET /api/automation/download-pdf?interviewId={id}
```

**Schedule Interview**

```http
POST /api/automation/schedule
Content-Type: application/json

{
  "role": "Frontend Developer",
  "level": "mid",
  "type": "Technical",
  "techstack": ["React", "TypeScript"],
  "scheduledFor": "2025-10-30T14:00:00Z"
}
```

### Cron Job Endpoints (Protected)

All cron endpoints require `Authorization: Bearer {CRON_SECRET}` header.

```http
GET /api/cron/daily-streak
GET /api/cron/interview-reminders
GET /api/cron/weekly-reports
GET /api/cron/weekly-suggestions
```

**Response Format:**

```json
{
  "success": true,
  "notificationsSent": 5,
  "timestamp": "2025-10-30T09:00:00Z"
}
```

### Interview Endpoints

```http
POST /api/interviews/create
GET  /api/interviews/[id]
POST /api/interviews/[id]/feedback
```

### Vapi AI Integration

```http
POST /api/vapi/generate
```

Generates Vapi AI assistant configuration for voice interviews.

---

## 🏗️ Project Structure

```
NexusAgent.ai/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/             # Sign in page
│   │   ├── sign-up/             # Sign up page
│   │   └── forgot-password/     # Password reset
│   ├── (root)/                   # Protected routes
│   │   ├── page.tsx             # Dashboard with widgets
│   │   ├── settings/            # User settings & profile
│   │   └── interview/           # Interview pages
│   │       ├── page.tsx         # Interview setup
│   │       └── [id]/            # Dynamic interview routes
│   │           ├── page.tsx     # Interview session
│   │           └── feedback/    # Feedback display
│   ├── api/                      # API routes
│   │   ├── automation/          # Automation endpoints
│   │   │   ├── preferences/
│   │   │   ├── schedule/
│   │   │   ├── streak/
│   │   │   ├── suggestions/
│   │   │   ├── weekly-report/
│   │   │   └── download-pdf/
│   │   ├── cron/                # Cron job endpoints
│   │   │   ├── daily-streak/
│   │   │   ├── interview-reminders/
│   │   │   ├── weekly-reports/
│   │   │   └── weekly-suggestions/
│   │   ├── user/                # User endpoints
│   │   │   └── profile/
│   │   ├── vapi/                # Vapi AI integration
│   │   └── logs/                # Logging endpoints
│   ├── debug/                    # Debug pages
│   │   └── logs/                # Log viewer
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── Agent.tsx                # Interview agent component
│   ├── AuthForm.tsx             # Authentication form
│   ├── InterviewCard.tsx        # Interview list item
│   ├── StreakDisplay.tsx        # Streak widget
│   ├── SuggestionsCarousel.tsx  # Suggestions carousel
│   └── ...
│
├── lib/                          # Utility functions
│   ├── actions/                 # Server actions
│   │   ├── auth.action.ts       # Authentication
│   │   ├── general.action.ts    # Interviews & feedback
│   │   ├── schedule.action.ts   # Interview scheduling
│   │   ├── streak.action.ts     # Streak management
│   │   ├── suggestions.action.ts # AI suggestions
│   │   ├── weekly-reports.action.ts # Weekly reports
│   │   └── user.action.ts       # User profile
│   ├── email-service.ts         # Email sending & templates
│   ├── pdf-service.ts           # PDF generation
│   ├── vapi.sdk.ts              # Vapi SDK wrapper
│   ├── logger.ts                # Server-side logging
│   ├── client-logger.ts         # Client-side logging
│   └── utils.ts                 # Utility functions
│
├── firebase/                     # Firebase configuration
│   ├── admin.ts                 # Admin SDK (server)
│   └── client.ts                # Client SDK (browser)
│
├── types/                        # TypeScript definitions
│   ├── index.d.ts               # Main types
│   └── vapi.d.ts                # Vapi types
│
├── constants/                    # Constants
│   └── index.ts
│
├── public/                       # Static assets
│   ├── badges/
│   ├── covers/
│   ├── logo.svg
│   └── robot.png
│
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Environment template
├── vercel.json                   # Vercel config (cron jobs)
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
├── next.config.ts                # Next.js config
├── package.json                  # Dependencies
├── README.md                     # This file
├── AUTOMATION_SETUP.md           # Automation guide
└── LOGGING.md                    # Logging documentation
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/nexusagent-ai.git
   git push -u origin main
   ```

2. **Connect to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables

3. **Add Environment Variables**

   In Vercel Dashboard → Settings → Environment Variables, add all variables from `.env.local`:

   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `NEXT_PUBLIC_VAPI_PUBLIC_KEY`
   - `VAPI_PRIVATE_KEY`
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
   - `CRON_SECRET`

4. **Deploy**

   Click "Deploy" and wait for the build to complete.

5. **Verify Cron Jobs**

   Go to Project → Settings → Cron Jobs to ensure all 4 jobs are registered:

   - Interview Reminders (every 6 hours)
   - Daily Streak Check (daily at 9 AM UTC)
   - Weekly Reports (Monday at 10 AM UTC)
   - Weekly Suggestions (Wednesday at 3 PM UTC)

### Alternative Deployment Options

<details>
<summary><b>Deploy to Netlify</b></summary>

```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

**Note**: Cron jobs won't work on Netlify. You'll need to use Netlify Functions or external cron services.

</details>

<details>
<summary><b>Deploy with Docker</b></summary>

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t nexusagent-ai .
docker run -p 3000:3000 --env-file .env.local nexusagent-ai
```

</details>

---

## 📖 Usage Guide

### For Candidates

1. **Create Account**

   - Sign up with email/password
   - Complete your profile in Settings
   - Set your notification preferences

2. **Practice Interviews**

   - Choose interview type (Technical, Behavioral, System Design)
   - Select your experience level (Junior, Mid, Senior)
   - Pick relevant tech stack
   - Start the AI-powered interview

3. **Review Feedback**

   - Get instant AI-generated feedback
   - Download professional PDF report
   - Track your progress over time

4. **Schedule Future Interviews**

   - Plan practice sessions in advance
   - Receive automatic reminders
   - Build consistent practice habits

5. **Monitor Progress**
   - Check your practice streak on dashboard
   - Review weekly performance summaries
   - Follow AI-powered recommendations

### Automated Email Examples

<details>
<summary><b>📧 Interview Reminder Email</b></summary>

```
Subject: Reminder: Your Frontend Developer Interview Tomorrow

Hi John,

This is a friendly reminder about your upcoming interview:

Interview Details:
- Role: Frontend Developer
- Level: Mid
- Type: Technical
- Tech Stack: React, TypeScript, Next.js
- Scheduled: Tomorrow at 2:00 PM

Preparation Tips:
✓ Review React hooks and lifecycle methods
✓ Practice implementing TypeScript interfaces
✓ Brush up on Next.js App Router concepts

[Start Interview Early]

Good luck!
NexusAgent.ai Team
```

</details>

<details>
<summary><b>📄 Feedback Ready Email (with PDF)</b></summary>

```
Subject: Your Frontend Developer Interview Feedback is Ready!

Hi John,

Great job completing your interview! Here's your performance summary:

Overall Score: 75/100 (Good)

Quick Stats:
✓ Technical Skills: 80/100
✓ Communication: 70/100
✓ Problem Solving: 75/100

Your detailed feedback report is attached as a PDF.

[View Feedback Online] [Download PDF]

Key Strengths:
• Strong understanding of React fundamentals
• Clear communication style

Areas to Improve:
• Practice more advanced TypeScript patterns
• Work on system design thinking

Keep practicing!
NexusAgent.ai Team
```

</details>

<details>
<summary><b> Weekly Progress Report</b></summary>

```
Subject: Your Weekly Interview Progress Report

Hi John,

Here's your performance summary for Oct 23 - Oct 29, 2025:

This Week's Stats:
📝 Interviews Completed: 5
📈 Average Score: 78/100
🔥 Current Streak: 7 days

Top Performing Areas:
✓ React & Component Design (85/100)
✓ JavaScript Fundamentals (82/100)
✓ Communication Skills (80/100)

Focus Areas:
→ System Design (65/100)
→ Database Concepts (68/100)

Interview History:
Mon - Full Stack Developer (80/100)
Wed - React Developer (75/100)
Thu - Frontend Lead (82/100)
Sat - Senior Developer (76/100)
Sun - Tech Lead (77/100)

[View Detailed Report] [Download PDF]

Keep up the great work!
NexusAgent.ai Team
```

</details>

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork the Repository**

   ```bash
   # Fork via GitHub UI, then:
   git clone https://github.com/your-username/NexusAgent.ai.git
   cd NexusAgent.ai
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make Your Changes**

   - Write clean, documented code
   - Follow existing code style
   - Add TypeScript types
   - Test thoroughly

4. **Commit with Conventional Commits**

   ```bash
   git commit -m "feat: add amazing new feature"
   git commit -m "fix: resolve PDF generation issue"
   git commit -m "docs: update README"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/amazing-new-feature
   ```
   Then create a Pull Request on GitHub.

### Contribution Guidelines

- **Code Style**: Follow existing patterns, use TypeScript
- **Testing**: Test all new features locally
- **Documentation**: Update README and relevant docs
- **Commits**: Use conventional commit messages
- **Issues**: Check existing issues before creating new ones

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage
- 🌐 Internationalization

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack (recommended)
npm run dev:next     # Start dev server with standard Next.js

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting errors automatically
npm run type-check   # Run TypeScript compiler check

# Testing (if tests are added)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

---

## 🔒 Security

### Best Practices

- ✅ All API routes use Firebase authentication
- ✅ Cron endpoints protected with Bearer tokens
- ✅ Environment variables never committed to Git
- ✅ Firestore security rules enforce data access
- ✅ HTTPS enforced in production
- ✅ User data encrypted at rest (Firebase default)

### Reporting Vulnerabilities

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email: kushagraagrawal128@gmail.com
3. Or create a private security advisory on GitHub

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 NexusAgent.ai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See [LICENSE](LICENSE) for full details.

---

## 📚 Additional Resources

### Documentation

- **[AUTOMATION_SETUP.md](AUTOMATION_SETUP.md)** - Comprehensive automation setup guide
- **[LOGGING.md](LOGGING.md)** - Logging system documentation

### External Documentation

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vapi AI Documentation](https://docs.vapi.ai/)
- [Google AI (Gemini) Documentation](https://ai.google.dev/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Tailwind CSS](https://tailwindcss.com/docs)


---

## � Support & Community

### Get Help

- 📖 **Documentation**: Start with [AUTOMATION_SETUP.md](AUTOMATION_SETUP.md)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/DS-Kushagra/NexusAgent.ai/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/DS-Kushagra/NexusAgent.ai/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/DS-Kushagra/NexusAgent.ai/discussions)

### Stay Updated

- ⭐ Star the repository on GitHub
- 👀 Watch for new releases
- 🍴 Fork to create your own version

---

## 🎯 Roadmap

### Coming Soon

- [ ] **Mobile App** - Native iOS/Android apps
- [ ] **Video Interviews** - Face-to-face mock interviews with AI
- [ ] **Team Features** - Company accounts for recruiting teams
- [ ] **Interview Templates** - Pre-built question sets for specific roles
- [ ] **Analytics Dashboard** - Advanced performance analytics
- [ ] **Integration APIs** - Connect with ATS systems
- [ ] **Multi-language Support** - Interview practice in multiple languages
- [ ] **Live Coding Challenges** - Integrated code editor for technical rounds
- [ ] **Mock Interview Marketplace** - Connect with human interviewers

### Completed

- [x] AI-powered interviews with Vapi integration
- [x] Automated email notifications
- [x] PDF report generation
- [x] Weekly progress summaries
- [x] Streak tracking system
- [x] User profile management
- [x] Advanced settings page
- [x] Dashboard widgets

---

<div align="center">

###  Ready to Ace Your Next Interview?

**[Try NexusAgent.ai Now →](https://nexus-agent.vercel.app/)**

---


</div>

