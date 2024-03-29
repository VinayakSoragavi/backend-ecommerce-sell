import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { request } from 'http';

@Controller('users')
export class UsersController {
    @Post('login')
    createUser(@Req() request:Request,@Res() response:Response){

    }
    
}
