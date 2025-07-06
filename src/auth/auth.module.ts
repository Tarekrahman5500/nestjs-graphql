import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, Profile, Tag, User } from '../entity';
import { Argon2Service } from './argon2.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Profile, Tag]), UserModule],
  providers: [AuthResolver, AuthService, Argon2Service],
})
export class AuthModule {}
