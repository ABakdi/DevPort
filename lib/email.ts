import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendMagicLinkEmail(email: string, url: string) {
  try {
    const result = await resend.emails.send({
      from: "DevPort <onboarding@resend.dev>",
      to: email,
      subject: "Sign in to DevPort",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #05070a; margin: 0; padding: 40px 20px; }
              .container { max-width: 480px; margin: 0 auto; background: #0D1117; border-radius: 12px; padding: 40px; border: 1px solid #1F2937; }
              .logo { font-size: 24px; font-weight: bold; color: #00E5FF; margin-bottom: 24px; }
              h1 { color: #ffffff; font-size: 24px; margin: 0 0 16px 0; }
              p { color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0; }
              .button { display: inline-block; background: #00E5FF; color: #000000; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin-bottom: 24px; }
              .note { color: #64748b; font-size: 14px; }
              .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #1F2937; color: #64748b; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">DevPort</div>
              <h1>Sign in to your account</h1>
              <p>Click the button below to sign in to your DevPort admin dashboard. This link will expire in 15 minutes.</p>
              <a href="${url}" class="button">Sign in to DevPort</a>
              <p class="note">If you didn't request this email, you can safely ignore it.</p>
              <div class="footer">
                DevPort &copy; ${new Date().getFullYear()}
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error }
  }
}
