import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: { error: "Too many contact requests from this IP, please try again after 15 minutes" },
  standardHeaders: true, 
  legacyHeaders: false,
});

const router: IRouter = Router();

router.post("/contact", contactLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body as {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };

  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    req.log.error("GMAIL_USER or GMAIL_APP_PASSWORD env vars not set");
    res.status(500).json({ error: "Email service not configured." });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  try {
    await transporter.sendMail({
      from: `"Website Contact" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `[Website] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#7c5e3c">New message from your website</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;font-weight:bold;width:100px">Name</td><td style="padding:8px">${name}</td></tr>
            <tr style="background:#f9f5f0"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold">Subject</td><td style="padding:8px">${subject}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f9f5f0;border-left:4px solid #7c5e3c;white-space:pre-wrap">${message}</div>
        </div>
      `,
    });

    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "Failed to send contact email");
    res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

export default router;
