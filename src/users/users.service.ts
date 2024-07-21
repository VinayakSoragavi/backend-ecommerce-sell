import { Injectable, NotFoundException } from '@nestjs/common';
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
    @InjectModel(Registeruser.name)
    private registeruserModel: Model<Registeruser>,
    private jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
    // token: string,
  ): Promise<{ user: Registeruser }> {
    const { name, phone, email, gender, designation, imgUrl } = createUserDto;

    // Create a new user entry in the Registeruser model
    const newUser = await this.registeruserModel.create({
      name,
      phone,
      email,
      gender,
      designation,
      imgUrl,
    });

    return { user: newUser };
  }

  async getUserdataById(
    userId: string,
  ): Promise<{ token: string; user: Registeruser | null }> {
    try {
      const user = await this.registeruserModel.findById(userId).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newToken = this.jwtService.sign({ id: user._id });
      return { token: newToken, user };
    } catch (error) {
      throw new Error(`Error fetching user data: ${error.message}`);
    }
  }

  async getAllUserdata(): Promise<Registeruser[]> {
    try {
      return await this.registeruserModel.find().exec();
    } catch (error) {
      throw new Error(`Error fetching user data: ${error.message}`);
    }
  }

  async updateUserImage(userId: string, imgUrl: string): Promise<void> {
    const user = await this.registeruserModel.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.imgUrl = imgUrl;

    await user.save();
  }

  async updateUser(
    userId: string,
    updateUserDto: CreateUserDto,
    // token: string,
  ): Promise<{ token: string; user: Registeruser | null }> {
    try {
      const user = await this.registeruserModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      Object.assign(user, updateUserDto);

      await user.save();

      const newToken = this.jwtService.sign({ id: user._id });
      return { token: newToken, user };
    } catch (error) {
      throw new Error(`Error updating user data: ${error.message}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.registeruserModel.findByIdAndDelete(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
}
