import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY || "re_dummy_key_for_demo"
const resend = new Resend(resendApiKey)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Jitume AIMS <hello@sharl-tech.co.ke>"

export async function dispatchMatchApprovedEmails(params: {
  creatorEmail: string
  creatorName: string
  clientEmail: string
  clientName: string
  jobTitle: string
  confidenceScore: number
  jobId: string
}) {
  const { creatorEmail, creatorName, clientEmail, clientName, jobTitle, confidenceScore, jobId } = params

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
        <a href="http://localhost:3000/dashboard/projects" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-top: 12px;">
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

  // 2. Send Email to Client
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
          Log in to your Client Portal to review their profile and initiate project kickoff.
        </p>
        <a href="http://localhost:3000/dashboard/projects" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-top: 12px;">
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
