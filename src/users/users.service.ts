import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/register.dto';
import { Registeruser } from './schema/users.schema';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('Registeruser') private usersModel: Model<any>,
    private jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
    token: string,
  ): Promise<{ token: string; user: User }> {
    const {
      name,
      username,
      phone,
      alterphone,
      whatsapp,
      empid,
      jobrole,
      jobmode,
      address,
      address_line,
      city,
      state,
      pincode,
    } = createUserDto;

    const decodedToken: any = this.jwtService.verify(token);
    const id = decodedToken.id;

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { status: 'register' },
      { new: true },
    );

    let email: string;
    if (updatedUser) {
      email = updatedUser.email;
    } else {
      throw new Error('User not found');
    }

    const newUser = await this.usersModel.create({
      id,
      name,
      username,
      phone,
      alterphone,
      email,
      whatsapp,
      empid,
      jobrole,
      jobmode,
      address,
      address_line,
      city,
      state,
      pincode,
    });

    const newToken = this.jwtService.sign({ id: newUser._id });

    return { token: newToken, user: newUser };
  }

  async getUserdata(
    token: string,
  ): Promise<{ token: string; user: User | null }> {
    try {
      const decodedToken: any = this.jwtService.verify(token);
      const id = decodedToken.id;
      const user: any = await this.usersModel.findOne({ id }).exec();
      if (!user) {
        throw new Error('User not found');
      }
      const newToken = this.jwtService.sign({ id: user._id });
      return { token: newToken, user };
    } catch (error) {
      throw new Error(`Error fetching user data: ${error.message}`);
    }
  }

  async getAllUserdata(token: string): Promise<User[]> {
    try {
      const decodedToken: any = this.jwtService.verify(token);
      const id = decodedToken.id;
      const user: any = await this.usersModel.findOne({ id }).exec();
      console.log(user);

      if (!user) {
        throw new Error('User not found');
      }
      const users: User[] = await this.usersModel.find().exec();
      return users;
    } catch (error) {
      throw new Error(`Error fetching user data: ${error.message}`);
    }
  }
}
