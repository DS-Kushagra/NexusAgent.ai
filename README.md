# NexusAgent.ai 🤖

**Get Interview-Ready with AI-Powered Practice & Feedback**

NexusAgent.ai is an intelligent interview preparation platform that provides realistic mock interviews using advanced AI technology. Practice with industry-standard questions, receive instant feedback, and improve your technical and behavioral interview skills.

## ✨ Features

- 🎯 **AI-Powered Interviews** - Practice with intelligent AI agents that simulate real interview scenarios
- 📊 **Instant Feedback** - Get detailed performance analysis and improvement suggestions
- 🛠️ **Tech Stack Specific** - Tailored questions for various technologies (React, Node.js, Python, etc.)
- 📈 **Progress Tracking** - Monitor your improvement over time with detailed analytics
- 🎤 **Voice Integration** - Practice with voice-based interviews using Vapi AI
- 🔐 **Secure Authentication** - Firebase-powered user authentication and data management
- 📱 **Responsive Design** - Seamless experience across all devices

## 🚀 Tech Stack

- **Frontend**: Next.js 15.3.3, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **Backend**: Next.js API routes, Firebase Admin
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI Integration**: Google AI SDK, Vapi AI
- **Voice Processing**: Vapi Web SDK
- **Form Management**: React Hook Form, Zod validation
- **Deployment**: Vercel (recommended)

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Main application pages
│   ├── api/               # API routes
│   └── debug/             # Debug and logging pages
├── components/            # Reusable UI components
├── firebase/              # Firebase configuration
├── lib/                   # Utility functions and actions
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
└── public/                # Static assets
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/nexusagent-ai.git
   cd nexusagent-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin (Server-side)
   FIREBASE_ADMIN_PRIVATE_KEY=your_admin_private_key
   FIREBASE_ADMIN_CLIENT_EMAIL=your_admin_client_email

   # Vapi AI Configuration
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
   VAPI_PRIVATE_KEY=your_vapi_private_key

   # Google AI
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
   ```

4. **Set up Firebase**

   - Create a new Firebase project
   - Enable Authentication and Firestore
   - Download the service account key
   - Configure the environment variables

5. **Set up Vapi AI**
   - Create a Vapi AI account
   - Get your API keys
   - Configure voice agents

## 🚀 Getting Started

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Create an account**

   Sign up and start practicing interviews!

## 📝 Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build the application for production
npm run start    # Start the production server
npm run lint     # Run ESLint for code quality
```

## 🎯 Usage

1. **Sign Up/Login** - Create your account or sign in
2. **Choose Interview Type** - Select from various interview categories
3. **Select Technology Stack** - Pick the technologies you want to be interviewed on
4. **Start Interview** - Begin your AI-powered mock interview
5. **Receive Feedback** - Get detailed analysis and improvement suggestions
6. **Track Progress** - Monitor your performance over time

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Set up security rules for your collections

### Vapi AI Setup

1. Sign up for Vapi AI
2. Create voice agents for interviews
3. Configure the interviewer prompts

## 📚 API Reference

### Interview Endpoints

- `POST /api/interviews/create` - Create a new interview session
- `GET /api/interviews/[id]` - Get interview details
- `POST /api/interviews/[id]/feedback` - Submit interview feedback

### Vapi Integration

- `POST /api/vapi/generate` - Generate Vapi AI assistant configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Firebase](https://firebase.google.com/) for backend services
- [Vapi AI](https://vapi.ai/) for voice AI capabilities
- [Vercel](https://vercel.com/) for hosting and deployment
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Join our community discussions
- Check the documentation

---

**Made with ❤️ for better interview preparation**
