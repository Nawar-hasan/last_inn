// Notification Service for Email, WhatsApp, and SMS
import nodemailer from "nodemailer"

interface NotificationPayload {
  type: "email" | "whatsapp" | "sms"
  recipient: string
  template: string
  data: Record<string, any>
}

// Email Service
export const emailService = {
  transporter: nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  }),

  async sendWelcomeEmail(email: string, name: string, courseTitle: string) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.log("[v0] Email service not configured, skipping email")
      return { success: false, message: "Email service not configured" }
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #551FBD 0%, #7C3AED 100%); padding: 40px 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Innovologia!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f9f9f9;">
          <p>Hi ${name},</p>
          <p>Welcome to the <strong>${courseTitle}</strong> course! We're excited to have you join our learning community.</p>
          <p>You now have access to:</p>
          <ul>
            <li>Complete video lessons</li>
            <li>Interactive quizzes</li>
            <li>Certificate upon completion</li>
            <li>Community support</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/student/courses" style="background: #551FBD; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Learning
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">Need help? Contact support@innovologia.com</p>
        </div>
      </div>
    `

    try {
      const result = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: `Welcome to ${courseTitle}!`,
        html: htmlContent,
      })
      console.log("[v0] Welcome email sent successfully")
      return { success: true, result }
    } catch (error: any) {
      console.error("[v0] Failed to send welcome email:", error.message)
      return { success: false, error: error.message }
    }
  },

  async sendCertificateEmail(email: string, name: string, courseTitle: string, certificateUrl: string) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #53FBA1 0%, #2DD4BF 100%); padding: 40px 20px; text-align: center; color: #000; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Congratulations!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f9f9f9;">
          <p>Hi ${name},</p>
          <p>You've successfully completed the <strong>${courseTitle}</strong> course!</p>
          <p>Your certificate is ready to download and share with your network.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${certificateUrl}" style="background: #53FBA1; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Download Certificate
            </a>
          </div>
        </div>
      </div>
    `

    try {
      const result = await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: `Your Certificate for ${courseTitle}`,
        html: htmlContent,
      })
      console.log("[v0] Certificate email sent successfully")
      return { success: true, result }
    } catch (error: any) {
      console.error("[v0] Failed to send certificate email:", error.message)
      return { success: false, error: error.message }
    }
  },

  async sendCompletionEmail(email: string, name: string, courseTitle: string) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFD900 0%, #FFC700 100%); padding: 40px 20px; text-align: center; color: #000; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Course Completed!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f9f9f9;">
          <p>Hi ${name},</p>
          <p>Great job completing the <strong>${courseTitle}</strong> course!</p>
          <p>You can now request your completion certificate.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/student/certificates" style="background: #FFD900; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Request Certificate
            </a>
          </div>
        </div>
      </div>
    `

    try {
      const result = await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: `You've Completed ${courseTitle}!`,
        html: htmlContent,
      })
      console.log("[v0] Completion email sent successfully")
      return { success: true, result }
    } catch (error: any) {
      console.error("[v0] Failed to send completion email:", error.message)
      return { success: false, error: error.message }
    }
  },

  async sendPaymentConfirmationEmail(
    email: string,
    name: string,
    courseTitle: string,
    amount: number,
    transactionId: string,
  ) {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #551FBD 0%, #7C3AED 100%); padding: 40px 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Payment Confirmed!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f9f9f9;">
          <p>Hi ${name},</p>
          <p>Thank you for your purchase! Your payment has been successfully processed.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Course:</strong> ${courseTitle}</p>
            <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
          </div>
          <p>You now have full access to the course. Start learning today!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/student/courses" style="background: #551FBD; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Your Course
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">Questions? Contact support@innovologia.com</p>
        </div>
      </div>
    `

    try {
      const result = await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: `Payment Confirmation - ${courseTitle}`,
        html: htmlContent,
      })
      console.log("[v0] Payment confirmation email sent successfully")
      return { success: true, result }
    } catch (error: any) {
      console.error("[v0] Failed to send payment confirmation email:", error.message)
      return { success: false, error: error.message }
    }
  },
}

// WhatsApp Service
export const whatsappService = {
  async sendMessage(phoneNumber: string, message: string) {
    const response = await fetch(process.env.WHATSAPP_API_URL || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber,
        type: "text",
        text: { body: message },
      }),
    })

    return response.json()
  },

  async sendWelcomeMessage(phoneNumber: string, name: string, courseTitle: string) {
    const message = `Hi ${name}!\n\nWelcome to ${courseTitle}! You're all set to start learning. Visit your dashboard to begin: ${process.env.NEXT_PUBLIC_SITE_URL}/student\n\nHappy learning! 🎓`
    return this.sendMessage(phoneNumber, message)
  },

  async sendCertificateMessage(phoneNumber: string, name: string, courseTitle: string) {
    const message = `Congratulations ${name}!\n\nYou've successfully completed ${courseTitle}!\nYour certificate is ready. Download it here: ${process.env.NEXT_PUBLIC_SITE_URL}/student/certificates`
    return this.sendMessage(phoneNumber, message)
  },
}

// SMS Service (Twilio)
export const smsService = {
  async sendMessage(phoneNumber: string, message: string) {
    const response = await fetch("https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        From: process.env.TWILIO_PHONE_NUMBER || "",
        To: phoneNumber,
        Body: message,
      }).toString(),
    })

    return response.json()
  },

  async sendWelcomeMessage(phoneNumber: string, name: string, courseTitle: string) {
    const message = `Welcome to ${courseTitle}, ${name}! Start learning at ${process.env.NEXT_PUBLIC_SITE_URL}`
    return this.sendMessage(phoneNumber, message)
  },
}

// Universal Notification Service
export const notificationService = {
  async send(payload: NotificationPayload) {
    try {
      switch (payload.type) {
        case "email":
          if (payload.template === "welcome") {
            return await emailService.sendWelcomeEmail(payload.recipient, payload.data.name, payload.data.courseTitle)
          } else if (payload.template === "certificate") {
            return await emailService.sendCertificateEmail(
              payload.recipient,
              payload.data.name,
              payload.data.courseTitle,
              payload.data.certificateUrl,
            )
          } else if (payload.template === "completion") {
            return await emailService.sendCompletionEmail(
              payload.recipient,
              payload.data.name,
              payload.data.courseTitle,
            )
          } else if (payload.template === "paymentConfirmation") {
            return await emailService.sendPaymentConfirmationEmail(
              payload.recipient,
              payload.data.name,
              payload.data.courseTitle,
              payload.data.amount,
              payload.data.transactionId,
            )
          }
          break

        case "whatsapp":
          if (payload.template === "welcome") {
            return await whatsappService.sendWelcomeMessage(
              payload.recipient,
              payload.data.name,
              payload.data.courseTitle,
            )
          } else if (payload.template === "certificate") {
            return await whatsappService.sendCertificateMessage(
              payload.recipient,
              payload.data.name,
              payload.data.courseTitle,
            )
          }
          break

        case "sms":
          if (payload.template === "welcome") {
            return await smsService.sendWelcomeMessage(payload.recipient, payload.data.name, payload.data.courseTitle)
          }
          break
      }
    } catch (error) {
      console.error("Notification service error:", error)
      throw error
    }
  },
}

// Export functions for easy access
export async function sendCertificateEmail(email: string, name: string, courseTitle: string, certificateUrl: string) {
  return emailService.sendCertificateEmail(email, name, courseTitle, certificateUrl)
}

export async function sendPaymentConfirmationEmail(
  email: string,
  name: string,
  courseTitle: string,
  amount: number,
  transactionId: string,
) {
  return emailService.sendPaymentConfirmationEmail(email, name, courseTitle, amount, transactionId)
}
