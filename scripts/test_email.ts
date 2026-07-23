import "dotenv/config"
import { sendEmail } from "../lib/email"

async function test() {
  console.log("Testing Resend email pipeline with key:", process.env.RESEND_API_KEY ? "CONFIGURED ✅" : "MISSING ❌")
  const res = await sendEmail({
    to: "sharlmon19@gmail.com",
    subject: "Synthos Live Email Verification",
    html: "<h1>Synthos Email Test</h1><p>Your Resend email pipeline is 100% verified and working!</p>",
  })
  console.log("Result:", res)
}

test()
