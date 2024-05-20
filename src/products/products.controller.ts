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
import { ProductsService } from './products.service';
import { ClientProductDto } from './dto/clientproducts.dto';
import { Response } from 'express';

@Controller('client')
export class ProductsController {
  constructor(private ProductsService: ProductsService) {}

  @Post('/products')
  async productAdd(
    @Body() clientProductDto: ClientProductDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const headers: any = req.headers;
    const token: any = headers?.productadd;

    if (!token) {
      return 'Please login the wesite';
    }

    try {
      const { product } = await this.ProductsService.addProduct(
        clientProductDto,
        token,
      );
      res.json({
        success: true,
        product,
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }
}
