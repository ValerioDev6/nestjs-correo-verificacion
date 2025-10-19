import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashingJSService {
  private readonly saltRounds = 10;

  /**
   * Hashes a plain text password using bcrypt
   * @param password The plain text password to hash
   * @returns Promise<string> The hashed password
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compares a plain text password with a hashed password
   * @param password The plain text password to compare
   * @param hashedPassword The hashed password to compare against
   * @returns Promise<boolean> True if passwords match, false otherwise
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
