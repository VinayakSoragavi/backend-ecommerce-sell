import { Body, Controller, Get, HttpStatus, Post, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { OtpDto } from './dto/otp.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/send-otp')
  async sendOtp(@Body() body: { email: string }): Promise<void> {
    await this.authService.sendOtpAndStoreData(body.email);
  }

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response): Promise<void> {
    try {
      const { token, user } =await this.authService.signUp(signUpDto);
      res.cookie('token', token, { /* cookie options */ }).status(HttpStatus.OK).json({
        success: true,
        token,
        user
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
    try {
      const { token, user, message,success } = await this.authService.login(loginDto);
      res.cookie('token', token, { /* cookie options */ }).status(HttpStatus.OK).json({
        success,
        token,
        user, message
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() otpDto: OtpDto, @Res() res: Response): Promise<void> {
    try {
      const { token } = await this.authService.forgot_password(otpDto);
      const cookieOptions = {
        maxAge: 3 * 60 * 1000,
        httpOnly: true,
      };
      res.cookie('token', token,  cookieOptions ).status(HttpStatus.OK).json({
        success: true,
        token,
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Post('/change-password')
  async changePassword(@Request() req, @Body('newPassword') newPassword: string, @Res() res: Response): Promise<void> {
    
    try {
      const result = await this.authService.change_password(req, newPassword);;
      res.json({
        success: true,
        message:result,
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get('/signout')
  async signOut(@Res() res: Response): Promise<void> {
    await this.authService.signOut(res);
  }

}