import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '../interfaces/password-hasher.interface';
import { Argon2Hash } from '../types/argon2.types';

@Injectable()
export class Argon2Service implements PasswordHasher {
  async hash(password: string): Promise<Argon2Hash> {
    const rawHash = await argon2.hash(password, { type: argon2.argon2id });
    return rawHash as Argon2Hash; // ✅ brand it
  }

  async verify(hash: Argon2Hash, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }
}
