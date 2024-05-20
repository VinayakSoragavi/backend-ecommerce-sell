import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Registeruser extends Document {

  @Prop({ unique: [true, 'Duplicate alrady register'] })
  id: string;

  @Prop({ required: [true, 'Please enter the name'] })
  name: string;

  @Prop({ required: [true, 'Please enter the username'] })
  username: string;

  @Prop({ required: [true, 'Please enter the phone'] })
  phone: number;

  @Prop()
  alterphone: number;

  @Prop({ required: [true, 'Please enter the email'] })
  email: string;

  @Prop({ required: [true, 'Please enter the whatsapp'] })
  whatsapp: number;

  @Prop({ required: [true, 'Please enter the jobrole'] })
  jobrole: string;

  @Prop({ required: [true, 'Please enter the employer id'] })
  empid: string;

  @Prop({ required: [true, 'Please enter the jobmode'] })
  jobmode: string;

  @Prop()
  address: string;

  @Prop()
  address_line: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  pincode: number;
}

export const UsersSchema = SchemaFactory.createForClass(Registeruser);
