import { Injectable } from '@nestjs/common';
import * as NodeCache from 'node-cache';

@Injectable()
export class TemporaryStorageService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 300 });
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  delete(key: string): any {
    return this.cache.del(key);
  }
}