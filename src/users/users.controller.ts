import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/register.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('userbox')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const headers: any = req.headers;
    const token: any = headers?.userlogin;

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Please login to the website',
      });
    }

    try {
      const { user } = await this.usersService.register(createUserDto);
      res.status(HttpStatus.OK).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Get('/:id')
  async getUserInfo(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const headers: any = req.headers;
    const token: any = headers?.userlogin;

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Please login to the website',
      });
    }

    try {
      const { token: newToken, user } =
        await this.usersService.getUserdataById(id);
      res
        .cookie('token', newToken, {
          httpOnly: true, // Secure it further with options if needed
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

  @Get()
  async getAllUserdata(
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const headers: any = req.headers;
    const token: any = headers?.userlogin;

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Please login to the website',
      });
    }

    try {
      const users = await this.usersService.getAllUserdata();
      res.json({
        success: true,
        users,
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const headers: any = req.headers;
    const token: any = headers?.userlogin;

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Please login to the website',
      });
    }

    try {
      const { token: newToken, user } = await this.usersService.updateUser(
        id,
        updateUserDto,
      );
      res
        .cookie('token', newToken, {
          httpOnly: true, // Secure it further with options if needed
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

  @Post('/upload/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileExtName = extname(file.originalname);
          const fileName = `${Date.now()}${fileExtName}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
    }),
  )
  async uploadFile(
    @Req() req: any,
    @Res() res: Response,
    @UploadedFile() file: any,
  ) {
    const userId = req.params.id;

    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    try {
      const imgUrl = `/uploads/${file.filename}`;
      await this.usersService.updateUserImage(userId, imgUrl);
      res.json({
        success: true,
        message: 'File uploaded successfully',
        imgUrl,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const headers: any = req.headers;
    const token: any = headers?.userlogin;

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Please login to the website',
      });
    }
    try {
      await this.usersService.deleteUser(id);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message,
      });
    }
  }
}
