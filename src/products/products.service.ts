import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/auth/schemas/user.schema';
import { ClientProductDto, ReviewDto } from './dto/clientproducts.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('Registeruser') private usersModel: Model<any>,
    @InjectModel('Clientproducts') private clientproducts: Model<any>,
    private jwtService: JwtService,
  ) {}

  async addProduct(
    clientProductDto: ClientProductDto,
    token: string,
  ): Promise<{ product: User }> {
    const decodedToken: any = this.jwtService.verify(token);
    const _id = decodedToken.id;
    const user: any = await this.usersModel.findOne({ _id }).exec();
    console.log(user);

    if (user.jobrole !== 'Business developer') {
      throw new Error('User not found');
    }

    let business_developer = user.name;

    const {
      category,
      name,
      price,
      deliveryDate,
      productFeature,
      productPoints,
      productNote,
      offers,
      reviews,
    } = clientProductDto;

    const newProduct = await this.clientproducts.create({
      category,
      business_developer,
      name,
      price,
      deliveryDate,
      productFeature,
      productPoints,
      productNote,
      offers,
      reviews,
    });

    return { product: newProduct };
  }

  async updateProduct(
    productId: string,
    updatedProductData: ClientProductDto,
    token: string,
  ): Promise<{ product: User }> {
    const decodedToken: any = this.jwtService.verify(token);
    const id = decodedToken.id;
    const user: any = await this.usersModel.findOne({ id }).exec();
    if (user.jobrole !== 'Business developer') {
      throw new Error('User not authorized to update products');
    }

    const existingProduct = await this.clientproducts.findById(productId);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    existingProduct.category = updatedProductData.category;
    existingProduct.name = updatedProductData.name;
    existingProduct.price = updatedProductData.price;
    existingProduct.deliveryDate = updatedProductData.deliveryDate;
    existingProduct.productFeature = updatedProductData.productFeature;
    existingProduct.productPoints = updatedProductData.productPoints;
    existingProduct.productNote = updatedProductData.productNote;
    existingProduct.offers = updatedProductData.offers;
    existingProduct.reviews = updatedProductData.reviews;
    const updatedProduct = await existingProduct.save();
    return { product: updatedProduct };
  }

  async addReview(
    productId: string,
    reviewDto: ReviewDto,
    token: string,
  ): Promise<{ review: any }> {
    const decodedToken: any = this.jwtService.verify(token);
    const userId = decodedToken.id;

    const existingReview = await this.clientproducts.findOne({
      _id: productId,
      'reviews.userId': userId,
    });

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    const newReview = {
      userId,
      name: reviewDto.name,
      email: reviewDto.email,
      rating: reviewDto.rating,
      message: reviewDto.message,
      date: new Date(),
      like: 0,
      dislike: 0,
    };

    await this.clientproducts.findByIdAndUpdate(productId, {
      $push: { reviews: newReview },
    });

    return { review: newReview };
  }

  async editReview(
    productId: string,
    reviewId: string,
    editedMessage: string,
    token: string,
  ): Promise<{ updatedReview: any }> {
    const decodedToken: any = this.jwtService.verify(token);
    const userId = decodedToken.id;

    const reviewExists = await this.clientproducts.exists({
      _id: productId,
      'reviews._id': reviewId,
      'reviews.userId': userId,
    });

    if (!reviewExists) {
      throw new Error('Review not found or you are not authorized to edit');
    }

    await this.clientproducts.updateOne(
      { _id: productId, 'reviews._id': reviewId },
      { $set: { 'reviews.$.message': editedMessage } },
    );

    const updatedReview = await this.clientproducts.findOne(
      { _id: productId, 'reviews._id': reviewId },
      { 'reviews.$': 1 },
    );

    return { updatedReview };
  }

  async deleteReview(
    productId: string,
    reviewId: string,
    token: string,
  ): Promise<{ message: string }> {
    const decodedToken: any = this.jwtService.verify(token);
    const userId = decodedToken.id;

    // Check if the review exists and belongs to the user
    const reviewExists = await this.clientproducts.exists({
      _id: productId,
      'reviews._id': reviewId,
      'reviews.userId': userId,
    });

    if (!reviewExists) {
      throw new Error('Review not found or you are not authorized to delete');
    }

    // Delete the review
    await this.clientproducts.updateOne(
      { _id: productId },
      { $pull: { reviews: { _id: reviewId } } },
    );

    return { message: 'Review deleted successfully' };
  }
}
