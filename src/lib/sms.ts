import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client: twilio.Twilio | null = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export async function sendSMS(to: string, message: string): Promise<boolean> {
  if (!client || !fromNumber) {
    console.log('SMS not configured. Would send:', { to, message });
    return false;
  }

  try {
    await client.messages.create({
      body: message,
      from: fromNumber,
      to,
    });
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

export async function sendReminderNotification(
  phoneNumber: string,
  reminderTitle: string,
  reminderDescription?: string
): Promise<boolean> {
  const message = reminderDescription
    ? `🌸 Reminder: ${reminderTitle}\n${reminderDescription}`
    : `🌸 Reminder: ${reminderTitle}`;

  return sendSMS(phoneNumber, message);
}

export async function sendInsightNotification(
  phoneNumber: string,
  insightTitle: string,
  insightContent: string
): Promise<boolean> {
  const message = `💜 ${insightTitle}\n\n${insightContent}\n\nOpen your journal app for more details.`;
  return sendSMS(phoneNumber, message);
}

export function isSMSConfigured(): boolean {
  return !!(accountSid && authToken && fromNumber);
}
