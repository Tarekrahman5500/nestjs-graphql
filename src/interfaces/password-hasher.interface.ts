import { Argon2Hash } from '../types/argon2.types';

export interface PasswordHasher {
  hash(password: string): Promise<Argon2Hash>;
  verify(hash: Argon2Hash, password: string): Promise<boolean>;
}
