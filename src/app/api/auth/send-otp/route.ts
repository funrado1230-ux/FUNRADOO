import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { transporter } from "@/lib/mailer";
import { otpStore } from "@/lib/otp-store";



// Temporary development storage.
// Replace this with MongoDB before production.

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    otpStore.set(email, {
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });

    const mailResult = await transporter.sendMail({
      from: `"FUNRADO" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your FUNRADO Verification Code",
      text: `Your FUNRADO verification code is ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="
          max-width:520px;
          margin:auto;
          padding:32px;
          border:1px solid #e5e7eb;
          border-radius:16px;
          font-family:Arial, sans-serif;
        ">
          <h1 style="margin:0 0 12px;color:#111827;">
            FUNRADO
          </h1>

          <h2 style="color:#111827;">
            Verify your email
          </h2>

          <p style="color:#4b5563;font-size:16px;">
            Use the verification code below to continue:
          </p>

          <div style="
            margin:24px 0;
            padding:18px;
            background:#f3f4f6;
            border-radius:12px;
            text-align:center;
            font-size:34px;
            font-weight:bold;
            letter-spacing:10px;
            color:#111827;
          ">
            ${otp}
          </div>

          <p style="color:#4b5563;">
            This code expires in 5 minutes.
          </p>

          <p style="color:#6b7280;font-size:13px;">
            Never share this verification code with anyone.
          </p>
        </div>
      `,
    });

    console.log("OTP email accepted:", mailResult.messageId);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully. Please check your inbox and spam folder.",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send OTP email.",
      },
      { status: 500 }
    );
  }
}