import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, Profile, Tag, User } from '../entity';
import { LoaderModule } from '../loader/loader.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Profile, Tag]), LoaderModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
