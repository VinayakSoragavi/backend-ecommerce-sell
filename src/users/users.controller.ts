import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/register.dto';
import { Response } from 'express';
import { get } from 'http';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const headers: any = req.headers;
    const token: any = headers?.userlogin;

    if (!token) {
      return 'Please login the wesite';
    }

    try {
      const { token: newToken, user } = await this.usersService.register(
        createUserDto,
        token,
      );
      res
        .cookie('token', newToken, {
          /* cookie options */
        })
        .status(HttpStatus.OK)
        .json({
          success: true,
          token: newToken,
          user,
        });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get('/user')
  async getUserInfo(@Res() res: Response, @Req() req: Request): Promise<any> {
    const headers: any = req.headers;
    const token: any = headers?.userlogin;

    if (!token) {
      return 'Please login the wesite';
    }

    try {
      const { token: newToken, user } =
        await this.usersService.getUserdata(token);
      res
        .cookie('token', newToken, {
          /* cookie options */
        })
        .status(HttpStatus.OK)
        .json({
          success: true,
          token: newToken,
          user: user,
        });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get('/users')
  async getAllUserdata(
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const headers: any = req.headers;
    const token: any = headers?.userlogin;

    if (!token) {
      return 'Please login the wesite';
    }
    try {
      const users = await this.usersService.getAllUserdata(token);
      res.json({
        success: true,
        users: users,
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }
}
