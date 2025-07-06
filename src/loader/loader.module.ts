import { Module } from '@nestjs/common';
import { ProfileLoaderService } from './profile.loader.service';
import { PostLoaderService } from './post.loader.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, Profile } from '../entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Post])],
  providers: [ProfileLoaderService, PostLoaderService],
  exports: [ProfileLoaderService, PostLoaderService],
})
export class LoaderModule {}
