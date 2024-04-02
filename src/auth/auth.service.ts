import { HttpStatus, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { OtpService } from './otp.service';
import { TemporaryStorageService } from './temporary-storage.service';
import { OtpDto } from './dto/otp.dto';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private readonly otpService: OtpService,
        private readonly temporaryStorageService: TemporaryStorageService,
      ) {}

  async sendOtpAndStoreData(email: string): Promise<void> {
    const otp = this.otpService.generateOtp();
    await this.otpService.sendOtpByEmail(email, otp);
    this.temporaryStorageService.delete(email);
    this.temporaryStorageService.set(email, otp);
  }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string; user: any }> {
    const { name, email, password,otp } = signUpDto;
    const storedOtp = this.temporaryStorageService.get(email);
    this.temporaryStorageService.delete(email);
    if (storedOtp === otp) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const status="login"

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      status
    });

    const userWithoutPassword = { ...user.toObject(), password: undefined };

    const token = this.jwtService.sign({ id: user._id });

    return { token, user: userWithoutPassword };
} else {
    throw new Error('Invalid OTP');
  }
  }

  async login(loginDto: LoginDto): Promise<{ token?: string; user?: any; message?: string;success:boolean }> {
    const { email, password } = loginDto;
  
    const user = await this.userModel.findOne({ email });
  
    if (!user) {
      return { success:false,message: 'Invalid email or password' };
    }
  
    const isPasswordMatched = await bcrypt.compare(password, user.password);
  
    if (!isPasswordMatched) {
      return {success:false, message: 'Invalid email or password' };
    }
  
    const userWithoutPassword = { ...user.toObject(), password: undefined };
  
    const token = this.jwtService.sign({ id: user._id });
  
    return { success:true,token, user: userWithoutPassword };
  }

  async forgot_password(otpDto: OtpDto): Promise<{ token: string }> {
    const { email, otp } = otpDto;
  
    const storedOtp = this.temporaryStorageService.get(email);
  
    if (storedOtp && storedOtp === otp) {
      this.temporaryStorageService.delete(email);
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      const token = this.jwtService.sign({ id: user._id });
      return { token };
    } else {
      throw new Error('Invalid OTP');
    }
  }

  async change_password(req: Request, newPassword: string): Promise<any> {
    const token = req.headers.authorization
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const decodedToken: any = this.jwtService.decode(token);
    if (!decodedToken || !decodedToken.id) {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = decodedToken.id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });

    return 'Password changed successfully';
    }

    async signOut(res: Response): Promise<void> {
      try {
        res.status(HttpStatus.OK).json({ success: true, message: 'Sign-out successful' });
      } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to sign out' });
      }
    }
}

