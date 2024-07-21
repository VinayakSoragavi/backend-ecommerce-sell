import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as otpGenerator from 'otp-generator';
const Mailgen = require('mailgen');

@Injectable()
export class OtpService {
  generateOtp(): string {
    return otpGenerator.generate(6, { upperCase: false, specialChars: false });
  }

  async sendOtpByEmail(email: string, otp: string): Promise<string> {
    try {
      // Configure the transporter for Nodemailer
      const config = {
        service: 'gmail',
        auth: {
          user: process.env.OTP_EMAIL,
          pass: process.env.OTP_EMAIL_PASSWORD,
        },
      };

      const transporter = nodemailer.createTransport(config);

      // Create a new Mailgen instance
      const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
          name: 'Your Product Name',
          link: 'https://mailgen.js/',
        },
      });

      // Generate the email body
      const response = {
        body: {
          name: 'User',
          table: {
            data: [
              {
                name: 'OTP',
                value: otp,
              },
            ],
          },
        },
      };

      const mail = mailGenerator.generate(response);

      // Create the email message
      const message = {
        from: process.env.OTP_EMAIL,
        to: email,
        subject: 'Your OTP for Verification',
        html: mail,
      };

      // Send the email
      const info = await transporter.sendMail(message);
      console.log('Email sent: ' + info.response);
      return 'Email sent successfully!';
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
