import { Injectable, Scope } from '@nestjs/common';
import { Post } from '../entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
@Injectable({ scope: Scope.REQUEST })
export class PostLoaderService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  public readonly batchPosts = new DataLoader<number, Post[]>(
    async (userIds: number[]) => {
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .where('post.userId IN (:...userIds)', { userIds })
        .getMany();

      const postsMap = userIds.reduce((map, id) => {
        map.set(id, []);
        return map;
      }, new Map<number, Post[]>());

      for (const post of posts) {
        postsMap.get(post.userId)!.push(post);
      }

      return userIds.map((id) => postsMap.get(id)!);
    },
  );
}
