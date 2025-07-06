import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entity';
import { Repository } from 'typeorm';
import * as DataLoader from 'dataloader';

@Injectable({ scope: Scope.REQUEST })
export class ProfileLoaderService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  public readonly batchProfiles = new DataLoader<number, Profile | null>(
    async (userIds: number[]) => {
      const profiles = await this.profileRepository
        .createQueryBuilder('profile')
        .where('profile.userId IN (:...userIds)', { userIds })
        .getMany();

      const profileMap = new Map(profiles.map((p) => [p.userId, p]));
      return userIds.map((id) => profileMap.get(id) ?? null);
    },
  );
}
