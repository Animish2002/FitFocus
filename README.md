# 🧠 AI Productivity Coach

An AI-powered personal productivity planner built to help students like me balance gym, study, and life — especially during intense periods like CAT exam preparation.

---

## ✨ Features

- 📅 **Daily Planner**: Converts natural language into a realistic to-do list
- 💪 **Fitness Integration**: Adds weight training + cardio into your schedule
- 📚 **CAT Prep Focused**: Plans for QA, VARC, and DILR
- 🧠 **Powered by OpenAI GPT**: Smart AI-generated time-blocked tasks
- 📈 **Habit Tracker** *(Optional)*: Tracks your study and workout streaks
- 🖼️ **Minimal UI**: Built with React, Tailwind, and Framer Motion (optional)

---

## 🛠️ Tech Stack

| Layer       | Tech                       |
|-------------|----------------------------|
| Frontend    | React, Tailwind CSS        |
| Backend     | Node.js, Express           |
| AI API      | Mistral.ai                 |
| Auth & DB   | Supabase (optional)        |
| Deployment  | Vercel (Frontend), Render (Backend) |

---

## 🚀 How It Works

1. **User Input**: Describe your day (e.g., "I have college from 10–4, gym, and want to study QA.")
2. **AI Planning**: GPT generates a time-blocked day plan with gym + study
3. **Result**: Structured, actionable to-do list you can follow or save

---

## 🔧 Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install
# Add your OpenAI key in `.env`
echo "OPENAI_API_KEY=your_openai_key" > .env
node index.js
