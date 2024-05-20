import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // Import Types from mongoose

@Schema()
export class Clientproducts extends Document {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  business_developer: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  deliveryDate: Date;

  @Prop({ required: true })
  productFeature: string;

  @Prop({ required: true, type: Object })
  productPoints: Record<string, string>;

  @Prop({ required: true, type: Object })
  productNote: Record<string, string>;

  @Prop({ required: true, type: Object })
  offers: Record<string, string>;

  // Use Types.ObjectId instead of Schema.Types.ObjectId
  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: 'Review' }] })
  reviews: Review[];
}

@Schema()
export class Review extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  like: boolean;

  @Prop({ required: true })
  dislike: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Clientproducts);
