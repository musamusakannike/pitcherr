const RESEND_API_KEY = process.env.RESEND_API_KEY;

/**
 * HTML Template for Pitcherr Premium Welcome Email.
 * Reflects the app's minimal, paper-textured, print-inspired design with sleek typography and purple accents.
 */
function getPremiumWelcomeEmailTemplate(userName: string, expiryDate?: Date): string {
  const formattedExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Pitcherr Premium</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf9f6; font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #111827; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf9f6; padding: 24px 0;">
    <tr>
      <td align="center">
        <!-- Main Paper Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border: 1px solid rgba(17, 17, 17, 0.08); border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.03); margin: 20px 0; text-align: left;">
          <tr>
            <td style="padding: 40px;">
              
              <!-- Header Brand Logo -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 800; tracking: -0.5px; color: #111111; text-transform: uppercase;">
                      PITCHERR<span style="color: #8b5cf6;">.</span>
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-family: 'PT Mono', 'Courier New', monospace; font-size: 10px; font-weight: 700; color: #8b5cf6; background-color: rgba(139, 92, 246, 0.08); padding: 4px 10px; border-radius: 100px; text-transform: uppercase; border: 1px solid rgba(139, 92, 246, 0.15);">
                      ★ Premium Account
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Print-style Dotted Separator -->
              <hr style="border: 0; border-top: 1px dashed rgba(17, 17, 17, 0.1); margin: 24px 0;" />

              <!-- User Greeting -->
              <h1 style="font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; font-size: 24px; font-weight: 800; color: #111111; margin: 0 0 16px 0; tracking: -0.3px;">
                Welcome to the high tier, ${userName}.
              </h1>

              <!-- Message Body -->
              <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                Your subscription has been successfully authorized through Paystack. You have unlocked unlimited tailored proposal matching, structured project outlines, and deep reasoning AI mode.
              </p>

              <!-- Receipt Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf9f6; border: 1px solid rgba(17, 17, 17, 0.06); border-radius: 6px; padding: 20px; margin-bottom: 28px;">
                <tr>
                  <td colspan="2" style="font-family: 'PT Mono', 'Courier New', monospace; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; padding-bottom: 12px; tracking: 0.5px;">
                    Subscription Details
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6b7280; padding: 4px 0;">Selected Plan:</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #111111; padding: 4px 0;">Premium Freelancer</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6b7280; padding: 4px 0;">Billing Rate:</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #111111; padding: 4px 0;">₦2,000 / month</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6b7280; padding: 4px 0;">Payment Provider:</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #111111; padding: 4px 0;">Paystack Checkout</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6b7280; padding: 4px 0;">Billing Cycle:</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #111111; padding: 4px 0;">Monthly Recurring</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6b7280; padding: 4px 0;">Expiry Date:</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #8b5cf6; padding: 4px 0;">${formattedExpiry}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6b7280; padding: 8px 0 0 0; border-top: 1px dashed rgba(17, 17, 17, 0.06);">Status:</td>
                  <td align="right" style="font-size: 13px; font-weight: 700; color: #16a34a; padding: 8px 0 0 0; border-top: 1px dashed rgba(17, 17, 17, 0.06);">✓ Subscribed & Active</td>
                </tr>
              </table>

              <!-- Call To Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 8px;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://pitcherr.co'}/dashboard" style="display: inline-block; background-color: #111111; color: #ffffff; font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1); text-transform: uppercase; tracking: 0.8px;">
                      Enter Proposal Workspace
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Print-style Dotted Separator -->
              <hr style="border: 0; border-top: 1px dashed rgba(17, 17, 17, 0.1); margin: 28px 0;" />

              <!-- Monospace Footer Advice -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="font-family: 'PT Mono', 'Courier New', monospace; font-size: 10px; color: #9ca3af; line-height: 1.5;">
                    Designed for premium freelance operators.<br />
                    &copy; 2026 Pitcherr Inc. All rights reserved.<br />
                    Lagos, Nigeria / Delaware, USA
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sends the Premium welcome onboarding email using Resend API.
 */
export async function sendPremiumWelcomeEmail(email: string, userName: string, expiryDate?: Date): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("[RESEND] API key is not configured. Skipping welcome email.");
    return false;
  }

  const formattedExpiry = expiryDate
    ? new Date(expiryDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  // If RESEND_API_KEY is "mock", simulate success and print simulated delivery to the console
  if (RESEND_API_KEY === "mock") {
    console.log(`\n================= [MOCK EMAIL SIMULATION] =================`);
    console.log(`Recipient: ${email}`);
    console.log(`Sender: Pitcherr Onboarding <onboarding@resend.dev>`);
    console.log(`Subject: Welcome to Pitcherr Premium! 🚀`);
    console.log(`Message Template Loaded for Customer: ${userName}`);
    console.log(`Premium Expiry Date: ${formattedExpiry}`);
    console.log(`===========================================================\n`);
    return true;
  }

  const html = getPremiumWelcomeEmailTemplate(userName, expiryDate);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Pitcherr Onboarding <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to Pitcherr Premium! 🚀",
        html: html,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[RESEND] API error response: ${errText}`);
      return false;
    }

    const resData = await response.json();
    console.log(`[RESEND] Successfully sent welcome email to ${email} (ID: ${resData.id})`);
    return true;
  } catch (error) {
    console.error("[RESEND] Failed to dispatch welcome email:", error);
    return false;
  }
}
