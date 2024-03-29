import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { OtpService } from './otp.service';
import { TemporaryStorageService } from './temporary-storage.service';

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
    this.temporaryStorageService.set(email, otp);
  }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string; user: any }> {
    const { name, email, password,otp } = signUpDto;
    const storedOtp = this.temporaryStorageService.get(email);
    if (storedOtp === otp) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = { ...user.toObject(), password: undefined };

    const token = this.jwtService.sign({ id: user._id });

    return { token, user: userWithoutPassword };
} else {
    throw new Error('Invalid OTP');
  }
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: any }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const userWithoutPassword = { ...user.toObject(), password: undefined };

    const token = this.jwtService.sign({ id: user._id });

    return { token, user: userWithoutPassword  };
  }
}