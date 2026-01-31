import OpenAI from 'openai';
import { JournalEntry } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AnalysisResult {
  overallMood: 'positive' | 'neutral' | 'concerning';
  moodTrend: 'improving' | 'stable' | 'declining';
  anxietyLevel: 'low' | 'moderate' | 'high';
  sleepQuality: 'good' | 'fair' | 'poor' | 'unknown';
  keyThemes: string[];
  concerns: string[];
  suggestions: string[];
  summary: string;
}

export interface InsightData {
  type: 'trend' | 'alert' | 'suggestion' | 'summary';
  severity: 'info' | 'warning' | 'concern';
  title: string;
  content: string;
  suggestions: string[];
}

export async function analyzeJournalEntries(
  entries: JournalEntry[]
): Promise<AnalysisResult | null> {
  if (!process.env.OPENAI_API_KEY || entries.length === 0) {
    return null;
  }

  const entrySummaries = entries.map((entry) => ({
    date: entry.date.toISOString().split('T')[0],
    mood: entry.mood,
    energy: entry.energy,
    anxiety: entry.anxiety,
    sleep: entry.sleep,
    content: entry.content.substring(0, 500), // Limit content length
  }));

  const prompt = `You are an AI wellness assistant specialized in postpartum mental health support. Analyze the following journal entries from a new parent and provide insights.

IMPORTANT: You are NOT a therapist or medical professional. Your role is to identify patterns and gently suggest when professional support might be helpful.

Journal Entries (from oldest to newest):
${JSON.stringify(entrySummaries, null, 2)}

Analyze these entries and respond with a JSON object containing:
{
  "overallMood": "positive" | "neutral" | "concerning",
  "moodTrend": "improving" | "stable" | "declining",
  "anxietyLevel": "low" | "moderate" | "high",
  "sleepQuality": "good" | "fair" | "poor" | "unknown",
  "keyThemes": ["array of recurring themes or topics"],
  "concerns": ["any concerning patterns that warrant attention"],
  "suggestions": ["gentle, actionable self-care suggestions"],
  "summary": "A warm, supportive 2-3 sentence summary of what you've observed"
}

Be compassionate and supportive. If you notice signs of postpartum depression or anxiety, gently suggest speaking with a healthcare provider. Focus on patterns, not individual bad days.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive wellness assistant. Always respond with valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]) as AnalysisResult;
  } catch (error) {
    console.error('AI analysis error:', error);
    return null;
  }
}

export async function generateInsights(
  entries: JournalEntry[]
): Promise<InsightData[]> {
  const analysis = await analyzeJournalEntries(entries);
  if (!analysis) return [];

  const insights: InsightData[] = [];

  // Add summary insight
  insights.push({
    type: 'summary',
    severity: 'info',
    title: 'Weekly Check-in',
    content: analysis.summary,
    suggestions: analysis.suggestions,
  });

  // Check for concerning mood trend
  if (analysis.moodTrend === 'declining' || analysis.overallMood === 'concerning') {
    insights.push({
      type: 'alert',
      severity: 'concern',
      title: 'Mood Pattern Noticed',
      content: "I've noticed your mood has been lower recently. This is very common in the postpartum period, and you're not alone. It might be helpful to talk to someone about how you're feeling.",
      suggestions: [
        'Consider reaching out to your healthcare provider',
        'Talk to a trusted friend or family member',
        'Remember that asking for help is a sign of strength',
      ],
    });
  }

  // Check for high anxiety
  if (analysis.anxietyLevel === 'high') {
    insights.push({
      type: 'alert',
      severity: 'warning',
      title: 'Anxiety Levels Elevated',
      content: 'Your recent entries suggest higher anxiety levels. Postpartum anxiety is very common and treatable.',
      suggestions: [
        'Try some gentle breathing exercises',
        'Take short breaks when possible',
        'Consider speaking with a professional if anxiety persists',
      ],
    });
  }

  // Check for poor sleep
  if (analysis.sleepQuality === 'poor') {
    insights.push({
      type: 'suggestion',
      severity: 'info',
      title: 'Sleep Support',
      content: 'Sleep deprivation is tough, and it affects everything. Even small improvements can help.',
      suggestions: [
        'Try to sleep when baby sleeps, even for short naps',
        'Ask for help with night duties if possible',
        'Limit screen time before bed',
      ],
    });
  }

  // Add positive reinforcement if things are going well
  if (analysis.overallMood === 'positive' && analysis.moodTrend === 'improving') {
    insights.push({
      type: 'suggestion',
      severity: 'info',
      title: "You're Doing Great",
      content: "Your entries show positive progress. Keep up the wonderful work - you're doing an amazing job as a parent.",
      suggestions: [
        'Continue the habits that are working for you',
        'Celebrate small wins',
        'Share your positive experiences with others',
      ],
    });
  }

  return insights;
}

export async function analyzeSingleEntry(
  entry: JournalEntry
): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const prompt = `You are a supportive wellness assistant for a new parent. Briefly analyze this journal entry and provide a short, warm reflection (2-3 sentences max).

Entry:
- Mood: ${entry.mood}/5
- Energy: ${entry.energy}/5
- Anxiety: ${entry.anxiety}/5
- Sleep: ${entry.sleep || 'not recorded'} hours
- Content: ${entry.content}

Respond with just the reflection, no JSON or formatting.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('AI analysis error:', error);
    return null;
  }
}
