import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY || "re_dummy_key_for_demo"
const resend = new Resend(resendApiKey)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Jitume AIMS <hello@sharl-tech.co.ke>"

export async function dispatchIntakeConfirmationEmail(params: {
  clientEmail: string
  clientName: string
  jobTitle: string
  budgetMin?: number
  budgetMax?: number
  timeline?: string
}) {
  const { clientEmail, clientName, jobTitle, budgetMin, budgetMax, timeline } = params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const budgetDisplay = budgetMin && budgetMax
    ? `KSh ${budgetMin.toLocaleString()} - KSh ${budgetMax.toLocaleString()}`
    : "KSh 500,000 - KSh 2,500,000"

  try {
    const subject = `⚡ Intake Confirmation: ${jobTitle}`
    const html = `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Brand Header -->
          <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 12px; font-family: monospace; font-weight: bold; color: #4f46e5; letter-spacing: 0.5px; text-transform: uppercase;">
              Jitume AIMS · AI-Driven Talent Marketplace
            </span>
          </div>

          <!-- Status Badge -->
          <div style="margin-bottom: 20px;">
            <span style="display: inline-block; background-color: #e0e7ff; border: 1px solid #c7d2fe; color: #3730a3; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; font-family: monospace;">
              ⚡ AI Matchmaker Active
            </span>
          </div>

          <!-- Greeting -->
          <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 8px;">
            Hello ${clientName || "Valued Client"},
          </h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for submitting your project request. Our Autonomous Scoper Agent has processed your intake requirements and activated the AI Match Matrix engine.
          </p>

          <!-- Inset Project Summary Box -->
          <div style="background-color: #f1f5f9; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px; margin: 24px 0;">
            <h4 style="color: #0f172a; font-size: 14px; font-weight: 700; margin: 0 0 12px 0; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">
              Project Deliverable Summary
            </h4>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Title:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-align: right;">${jobTitle}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Estimated Budget:</td>
                <td style="padding: 6px 0; color: #4f46e5; font-weight: 700; text-align: right;">${budgetDisplay}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Target Timeline:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-align: right;">${timeline || "6-8 Weeks"}</td>
              </tr>
            </table>
          </div>

          <!-- Next Steps Explanation -->
          <div style="margin-bottom: 28px;">
            <h4 style="color: #0f172a; font-size: 15px; font-weight: 700; margin-bottom: 8px;">
              What Happens Next?
            </h4>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">
              The AI Match Matrix engine is scanning our verified talent pool to identify candidate matches with 95%+ confidence scores. An Admin Committee Operator will review and confirm your developer recommendation shortly.
            </p>
          </div>

          <!-- Action Button -->
          <div style="text-align: left; padding-top: 8px;">
            <a href="${baseUrl}/" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              Return to Jitume AIMS Portal →
            </a>
          </div>

          <!-- Footer Note -->
          <div style="margin-top: 32px; padding-top: 16px; border-t: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 12px; font-family: monospace;">
            © ${new Date().getFullYear()} Jitume AIMS · Autonomous AI Matchmaking Platform
          </div>
        </div>
      </div>
    `

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [clientEmail],
        subject,
        html,
      })
      console.log(`[Resend Email Sent -> Client ${clientEmail}]: ${subject}`)
      return { success: true }
    } else {
      console.log(`[Resend Email Mock Dispatch -> Client ${clientEmail}]: ${subject}`)
      return { success: true, mock: true }
    }
  } catch (err) {
    console.error("Failed to send intake confirmation email via Resend:", err)
    return { success: false, error: err }
  }
}

export async function dispatchMatchApprovedEmails(params: {
  creatorEmail: string
  creatorName: string
  clientEmail: string
  clientName: string
  jobTitle: string
  confidenceScore: number
  jobId: string
  matchId: string
}) {
  const { creatorEmail, creatorName, clientEmail, clientName, jobTitle, confidenceScore, jobId, matchId } = params
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const results = { creatorEmailSent: false, clientEmailSent: false }

  // 1. Send Email to Creator
  try {
    const creatorSubject = `⚡ New Project Match Approved: ${jobTitle}`
    const creatorHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; margin-top: 0;">Congratulations, ${creatorName}!</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">
          You have been matched and approved by the Jitume AIMS Committee for a new high-value client project:
        </p>
        <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #cbd5e1; margin: 20px 0;">
          <h3 style="color: #4f46e5; margin: 0 0 8px 0;">${jobTitle}</h3>
          <p style="color: #64748b; font-size: 13px; margin: 0;">Match Score: <strong style="color: #059669;">${confidenceScore}% AI Confidence</strong></p>
        </div>
        <p style="color: #334155; font-size: 14px;">
          Log in to your Creator Portal to review the scope and accept the contract.
        </p>
        <a href="${baseUrl}/dashboard/projects" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-top: 12px;">
          View Matched Job & Accept Contract →
        </a>
      </div>
    `

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [creatorEmail],
        subject: creatorSubject,
        html: creatorHtml,
      })
      results.creatorEmailSent = true
    } else {
      console.log(`[Resend Email Mock Dispatch -> Creator ${creatorEmail}]: ${creatorSubject}`)
      results.creatorEmailSent = true
    }
  } catch (err) {
    console.error("Failed to send creator email via Resend:", err)
  }

  // 2. Send Email to Client (DIRECT MATCH VIEW ROUTE)
  try {
    const clientSubject = `🎯 Developer Match Confirmed: ${confidenceScore}% AI Match`
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; margin-top: 0;">Hello ${clientName},</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.6;">
          Our AI Matchmaker has selected your top developer match for <strong>${jobTitle}</strong>.
        </p>
        <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #cbd5e1; margin: 20px 0;">
          <h3 style="color: #059669; margin: 0 0 8px 0;">Verified Developer Matched</h3>
          <p style="color: #0f172a; font-size: 14px; margin: 0;">Developer: <strong>${creatorName}</strong></p>
          <p style="color: #4f46e5; font-size: 14px; margin: 4px 0 0 0;">AI Match Rating: <strong>${confidenceScore}% Match</strong></p>
        </div>
        <p style="color: #334155; font-size: 14px;">
          Review the developer profile and AI match rationale to initiate project kickoff.
        </p>
        <a href="${baseUrl}/client/match/${matchId}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-top: 12px;">
          Review Developer Profile →
        </a>
      </div>
    `

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [clientEmail],
        subject: clientSubject,
        html: clientHtml,
      })
      results.clientEmailSent = true
    } else {
      console.log(`[Resend Email Mock Dispatch -> Client ${clientEmail}]: ${clientSubject}`)
      results.clientEmailSent = true
    }
  } catch (err) {
    console.error("Failed to send client email via Resend:", err)
  }

  return results
}
