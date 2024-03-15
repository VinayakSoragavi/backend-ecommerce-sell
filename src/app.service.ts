import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const menu = {
      name: "prakash patil",
      age: 45
    };
    return JSON.stringify(menu);
  }
}
