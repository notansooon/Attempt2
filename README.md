# Postpartum Navigator

A supportive companion app for the postpartum journey, featuring AI-powered journaling insights and reminder notifications.

## Features

### Journaling with AI Overseer
- Write daily journal entries tracking mood, energy, anxiety, and sleep
- The AI analyzes your entries over time to identify patterns
- Receive gentle insights and suggestions based on your journal trends
- Not a chatbot - it's an overseer that watches for concerning patterns like depression or anxiety

### Smart Reminders
- Set reminders for medication, feeding schedules, self-care, and appointments
- Configure recurring reminders (daily or specific days)
- Receive SMS notifications to stay organized during the busy postpartum period

### AI Insights Dashboard
- View AI-generated insights based on your journal entries
- Get alerts when patterns suggest elevated anxiety or declining mood
- Receive supportive suggestions tailored to your situation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o-mini for journal analysis
- **SMS**: Twilio for reminder notifications

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
- `OPENAI_API_KEY` - For AI analysis (optional but recommended)
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` - For SMS notifications (optional)

4. Initialize the database:
```bash
npm run db:generate
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to use the app.

## Configuration

### AI Analysis
The AI analyzes journal entries to detect:
- Mood trends (improving, stable, declining)
- Anxiety levels
- Sleep quality patterns
- Recurring themes in entries

Configure analysis frequency in Settings:
- **Daily**: Automatic analysis every day
- **Weekly**: Automatic analysis once a week
- **Manual**: Only when you click "Generate Insights"

### SMS Notifications
To enable SMS notifications:
1. Create a Twilio account at https://www.twilio.com
2. Get your Account SID, Auth Token, and a phone number
3. Add credentials to your `.env` file
4. Enable notifications in Settings and add your phone number

### Cron Jobs (Optional)
For automatic reminder checking and insight generation, set up a cron job to call:
```
GET /api/cron
```

Add a `CRON_SECRET` to your `.env` for security, then include it as a Bearer token.

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── journal/       # Journal pages
│   ├── reminders/     # Reminder pages
│   ├── insights/      # AI insights page
│   ├── settings/      # Settings page
│   └── page.tsx       # Dashboard
├── components/        # React components
└── lib/
    ├── db.ts          # Prisma client
    ├── ai-analyzer.ts # AI analysis logic
    ├── sms.ts         # Twilio integration
    └── utils.ts       # Helper functions
```

## Important Notes

- This app is **not a replacement for professional medical care**
- If you're experiencing postpartum depression or anxiety, please reach out to a healthcare provider
- The AI provides supportive insights but cannot diagnose or treat conditions

### Support Resources
- Postpartum Support International: 1-800-944-4773
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741

## License

MIT
