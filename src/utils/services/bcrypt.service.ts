import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';
import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt();
    const password = typeof data === 'string' ? data : data.toString();
    return hash(password, salt);
  }

  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    const password = typeof data === 'string' ? data : data.toString();
    return compare(password, encrypted);
  }
}
