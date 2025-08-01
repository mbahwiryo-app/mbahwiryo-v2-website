interface EmailServiceConfig {
  provider: "resend" | "sendgrid" | "mailgun"
  apiKey: string
  fromEmail: string
}

interface EmailData {
  to: string[]
  subject: string
  html: string
  from?: string
}

export class EmailService {
  private config: EmailServiceConfig

  constructor(config: EmailServiceConfig) {
    this.config = config
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      switch (this.config.provider) {
        case "resend":
          return await this.sendWithResend(emailData)
        case "sendgrid":
          return await this.sendWithSendGrid(emailData)
        case "mailgun":
          return await this.sendWithMailgun(emailData)
        default:
          throw new Error("Unsupported email provider")
      }
    } catch (error) {
      console.error("Email sending failed:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  private async sendWithResend(emailData: EmailData) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailData.from || this.config.fromEmail,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      }),
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, id: result.id }
    } else {
      return { success: false, error: result.message || "Failed to send email" }
    }
  }

  private async sendWithSendGrid(emailData: EmailData) {
    // SendGrid implementation
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: emailData.to.map((email) => ({ email })),
            subject: emailData.subject,
          },
        ],
        from: { email: emailData.from || this.config.fromEmail },
        content: [
          {
            type: "text/html",
            value: emailData.html,
          },
        ],
      }),
    })

    if (response.ok) {
      return { success: true, id: response.headers.get("x-message-id") || "sent" }
    } else {
      const error = await response.text()
      return { success: false, error }
    }
  }

  private async sendWithMailgun(emailData: EmailData) {
    // Mailgun implementation
    const domain = "your-mailgun-domain.com"
    const formData = new FormData()
    formData.append("from", emailData.from || this.config.fromEmail)
    formData.append("to", emailData.to.join(","))
    formData.append("subject", emailData.subject)
    formData.append("html", emailData.html)

    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${this.config.apiKey}`).toString("base64")}`,
      },
      body: formData,
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, id: result.id }
    } else {
      return { success: false, error: result.message || "Failed to send email" }
    }
  }
}

// Factory function to create email service instance
export function createEmailService(): EmailService {
  const provider = (process.env.EMAIL_PROVIDER as "resend" | "sendgrid" | "mailgun") || "resend"
  const apiKey = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || process.env.MAILGUN_API_KEY || ""
  const fromEmail = process.env.FROM_EMAIL || "noreply@singkongkejumbahwiryo.com"

  return new EmailService({
    provider,
    apiKey,
    fromEmail,
  })
}
