import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error('Resend not connected');
  }

  return {
    apiKey: connectionSettings.settings.api_key as string,
    fromEmail: connectionSettings.settings.from_email as string,
  };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return { client: new Resend(apiKey), fromEmail };
}

export async function sendVerificationEmail(toEmail: string, fullName: string, code: string) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    const from = fromEmail || 'Paul Stanley Fan Club <onboarding@resend.dev>';

    const { error } = await client.emails.send({
      from,
      to: toEmail,
      subject: 'Your Verification Code – Paul Stanley Fan Club',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0a0a0a; color: #ffffff; border-radius: 8px;">
          <h1 style="color: #8b5cf6; font-size: 28px; margin-bottom: 8px;">Paul Stanley Fan Club</h1>
          <p style="color: #a1a1aa; margin-bottom: 24px;">Connecting Hearts, Changing Lives</p>
          <hr style="border-color: #27272a; margin-bottom: 24px;" />
          <p style="font-size: 16px; margin-bottom: 8px;">Hi ${fullName},</p>
          <p style="font-size: 15px; color: #d4d4d8; margin-bottom: 24px;">
            Thank you for joining! Use the verification code below to confirm your email address and activate your account.
          </p>
          <div style="background: #18181b; border: 2px solid #8b5cf6; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 14px; color: #a1a1aa; margin: 0 0 8px;">Your verification code</p>
            <p style="font-size: 40px; font-weight: bold; letter-spacing: 8px; color: #ffffff; margin: 0;">${code}</p>
          </div>
          <p style="font-size: 13px; color: #71717a;">This code expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    console.log(`Verification email sent to ${toEmail}`);
  } catch (err) {
    console.error('Failed to send verification email:', err);
    throw err;
  }
}
