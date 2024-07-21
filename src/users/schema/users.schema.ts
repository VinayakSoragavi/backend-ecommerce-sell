import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Registeruser extends Document {
  @Prop({ unique: [true, 'Duplicate already registered'] })
  id: string;

  @Prop({ required: [true, 'Please enter the name'] })
  name: string;

  @Prop({ required: [true, 'Please enter the phone'] })
  phone: number;

  @Prop({ required: [true, 'Please enter the email'] })
  email: string;

  @Prop({ required: [true, 'Please enter the gender'] })
  gender: string;

  @Prop({ required: [true, 'Please enter the designation'] })
  designation: string;

  @Prop({ required: false })
  imgUrl?: string; // Optional property for the image URL
}

export const UsersSchema = SchemaFactory.createForClass(Registeruser);
