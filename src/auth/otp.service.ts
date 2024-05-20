import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as otpGenerator from 'otp-generator';
import Mailgen from 'mailgen'; // Correctly import Mailgen

@Injectable()
export class OtpService {
  generateOtp(): string {
    return otpGenerator.generate(6, { upperCase: false, specialChars: false });
  }

  async sendOtpByEmail(email: string, otp: string): Promise<string> {
    try {
      const config = {
        service: 'gmail',
        auth: {
          user: 'appaddmaster@gmail.com',
          pass: 'eorvhibhmphmqsyg',
        },
      };

      const transporter = nodemailer.createTransport(config);

      const mailGenerator = new Mailgen({
        // Correctly instantiate Mailgen
        theme: 'default',
        product: {
          name: 'Your Product Name', // Update with your product name
          link: 'https://mailgen.js/',
        },
      });

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

      const message = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Your OTP for Verification',
        html: mail,
      };

      const info = await transporter.sendMail(message);
      console.log('Email sent: ' + info.response);
      return 'Email sent successfully!';
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
