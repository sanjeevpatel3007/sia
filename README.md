# SIA - AI Wellness Companion

**SIA** is an intelligent AI wellness companion that provides personalized support for mental health, stress management, and daily wellness planning. Built with Next.js 16, it integrates Google Calendar, advanced memory systems, and AI-powered conversations to create a comprehensive wellness experience.

## 🌟 Features

### 🤖 **AI-Powered Wellness Support**
- **Personalized Conversations**: Tailored wellness advice based on your preferences and history
- **Memory Integration**: Remembers your wellness journey, goals, and preferences using Mem0 AI
- **Context-Aware Responses**: Understands your calendar, mood, and personal context
- **Real-time Streaming**: Live AI responses for natural conversation flow

### 📅 **Calendar Integration**
- **Google Calendar Sync**: Seamless integration with your Google Calendar
- **Smart Scheduling**: AI suggests optimal break times and wellness activities
- **Meeting Analysis**: Analyzes your schedule to provide stress management advice
- **Calendar-Aware Wellness**: Tailored recommendations based on your daily schedule

### 💾 **Advanced Memory System**
- **Persistent Memory**: Remembers conversations, preferences, and wellness goals
- **Intelligent Extraction**: Automatically extracts meaningful information from conversations
- **Personalized Context**: Uses memory to provide increasingly personalized advice
- **Privacy-Focused**: User-specific memory isolation and secure storage

### 🎨 **Modern User Interface**
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS
- **Interactive Components**: Rich UI components with Radix UI primitives
- **Real-time Updates**: Live chat interface with streaming responses
- **Accessibility**: Built with accessibility best practices

## 🏗️ **Project Structure**

```
sia/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── chat/          # Chat API endpoints
│   │   │   ├── debug-scopes/  # Debug utilities
│   │   │   └── test-calendar/ # Calendar testing
│   │   ├── auth/              # Authentication pages
│   │   ├── chat/              # Chat interface pages
│   │   └── layout.tsx         # Root layout
│   ├── components/             # React Components
│   │   ├── ui/                # Reusable UI components
│   │   ├── ChatInterface.tsx  # Main chat component
│   │   ├── QuickPrompts.tsx   # Wellness prompt suggestions
│   │   ├── LoadingSteps.tsx   # Loading animations
│   │   └── sidebar.tsx        # Chat history sidebar
│   ├── contexts/              # React Context Providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── ChatContext.tsx    # Chat state management
│   ├── lib/                   # Utility Libraries
│   │   ├── google-ai.ts       # Google AI SDK integration
│   │   ├── google-calendar.ts # Calendar API integration
│   │   ├── mem0.ts           # Memory system integration
│   │   ├── supabase.ts       # Database client
│   │   └── database.ts       # Database operations
│   └── actions/               # Server Actions
│       └── chat-history.actions.ts
├── public/                    # Static assets
├── components.json            # UI component configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Google Cloud Console project with Calendar API enabled
- Supabase account
- Mem0 AI account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sia
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Mem0 AI Configuration
   MEM0_API_KEY=your_mem0_api_key
   
   # Application Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Database Setup**
   Create the following tables in your Supabase database:
   ```sql
   -- Chat Sessions Table
   CREATE TABLE chat_sessions (
     id TEXT PRIMARY KEY,
     user_id TEXT NOT NULL,
     title TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Chat Messages Table
   CREATE TABLE chat_messages (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT NOT NULL,
     session_id TEXT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
     role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     metadata JSONB
   );
   
5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 **API Endpoints**

### **Chat API**
- **POST** `/api/chat` - Main chat endpoint with AI responses
  - Supports streaming responses
  - Integrates calendar and memory context
  - Handles session management

- **POST** `/api/chat/session` - Session management
  - Create new chat sessions
  - Add messages to existing sessions

### **Authentication API**
- **GET** `/api/auth/callback` - OAuth callback handler
- **GET** `/api/auth/calendar-callback` - Calendar permission callback

### **Debug & Testing API**
- **POST** `/api/debug-scopes` - Debug OAuth scopes
- **GET** `/api/google-oauth-test` - Test Google OAuth flow
- **GET** `/api/test-calendar` - Test calendar access

## 🧠 **AI Models & Memory**

### **Google Gemini 2.5 Flash**
- **Model**: `gemini-2.5-flash`
- **Integration**: Via Google AI SDK
- **Features**: 
  - Real-time streaming responses
  - Context-aware conversations
  - Calendar integration
  - Memory-enhanced responses

### **Mem0 AI Memory System**
- **Purpose**: Persistent, intelligent memory storage
- **Features**:
  - User-specific memory isolation
  - Automatic fact extraction
  - Context-aware memory retrieval
  - Privacy-focused storage

- **Memory Functions**:
  ```typescript
  // Search user memories
  searchUserMemories(userId: string, query: string)
  
  // Add intelligent memories
  addIntelligentMemories(userId: string, messages: Message[])
  
  // Format memories for context
  formatMemoriesForContext(memories: Memory[])
  ```

## 🛠️ **User Tools & Workflow**

### **Authentication Flow**
1. **Google OAuth Sign-in**: Secure authentication with Google
2. **Calendar Permission**: Optional calendar access for enhanced features
3. **Session Management**: Persistent user sessions with Supabase

### **Chat Workflow**
1. **Session Creation**: Automatic session creation for new conversations
2. **Memory Retrieval**: Relevant memories loaded based on conversation context
3. **Calendar Integration**: Schedule analysis for personalized advice
4. **AI Response**: Context-aware responses with streaming
5. **Memory Storage**: Intelligent extraction and storage of important information



### **Calendar Integration**
- **Permission Management**: Secure Google Calendar access
- **Event Analysis**: AI analyzes your schedule for wellness insights
- **Smart Suggestions**: Break recommendations and stress management
- **Privacy-First**: Calendar data processed securely and privately

## 📦 **Dependencies**

### **Core Framework**
- **Next.js 16.0.0**: React framework with App Router
- **React 19.2.0**: UI library
- **TypeScript 5**: Type safety

### **AI & Machine Learning**
- **@ai-sdk/google**: Google AI SDK integration
- **@ai-sdk/react**: React hooks for AI
- **mem0ai**: Memory management system

### **Database & Authentication**
- **@supabase/supabase-js**: Database and authentication
- **Google OAuth**: Calendar integration

### **UI Components**
- **@radix-ui**: Accessible UI primitives
- **Tailwind CSS 4**: Utility-first CSS framework
- **Lucide React**: Icon library
- **class-variance-authority**: Component variants



## 🔒 **Security & Privacy**

- **Row Level Security**: Database-level user isolation
- **OAuth 2.0**: Secure authentication flow
- **Environment Variables**: Sensitive data protection
- **User-Specific Memory**: Isolated memory storage per user
- **Calendar Privacy**: Secure calendar data handling





## 🙏 **Acknowledgments**

- **Google AI**: For providing the Gemini AI model
- **Mem0**: For the intelligent memory system
- **Supabase**: For the database and authentication platform
- **Vercel**: For the deployment platform

---

