import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as otpGenerator from 'otp-generator';
import * as mailgen from 'mailgen';
import { Request } from 'express';

@Injectable()
export class OtpService {

  generateOtp(): string {
    return otpGenerator.generate(6, { upperCase: false, specialChars: false });
  }

  async sendOtpByEmail(email:string, otp:string): Promise<string> {
    try {
      let config = {
        service: 'gmail',
        auth: {
            user: "appaddmaster@gmail.com",
            pass: "eorvhibhmphmqsyg",
          },
      };

      let transporter = nodemailer.createTransport(config);

      let mailGenerator = new mailgen({
        theme: 'default',
        product: {
          name: "Your Product Name", // Update with your product name
          link: 'https://mailgen.js/',
        },
      });

      let response = {
        body: {
          name: "User",
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

      let mail = mailGenerator.generate(response);

      let message = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Your OTP for Verification',
        html: mail,
      };

      let info = await transporter.sendMail(message);
      console.log('Email sent: ' + info.response);
      return 'Email sent successfully!';
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
