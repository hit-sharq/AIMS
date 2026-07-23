import { Resend } from "resend"

export async function sendEmail(params: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured. Email not sent.")
    return { skipped: true }
  }

  const resend = new Resend(apiKey)

  try {
    const fromAddress = params.from || process.env.RESEND_FROM_EMAIL || "Synthos <onboarding@resend.dev>"

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    if (error) {
      console.error("Resend error:", error)
      return { error }
    }

    console.log(`✉️ Email successfully dispatched to ${params.to}: ID ${data?.id}`)
    return { data }
  } catch (err) {
    console.error("Failed to send email:", err)
    return { error: err }
  }
}
