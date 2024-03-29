import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({required:"Please enter the username"})
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({required:"Please enter the password"})
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);