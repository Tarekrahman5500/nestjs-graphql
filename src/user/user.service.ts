import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile, User } from '../entity';
import { Repository } from 'typeorm';

import { UserUpdateInputDto } from './dto/user.update.input.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException({
        message: `User with ID ${id} not found`,
        statusCode: 401,
      });
    }
    return user;
  }

  // now create a user
  async create(user: User, profile: Profile): Promise<User> {
    // Save the user
    const savedUser = await this.userRepository.save(user);

    // Attach user reference to profile
    profile.userId = savedUser.id;
    profile.user = Promise.resolve(savedUser); // or just `savedUser` if eager

    // Save the profile
    await this.profileRepository.save(profile);

    return savedUser;
  }

  async update(id: number, updateData: UserUpdateInputDto): Promise<User> {
    // 1. Find existing user (with profile)
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) throw new Error('User not found');

    // 2. Update user fields (username, email)
    if (updateData.username !== undefined) user.username = updateData.username;
    if (updateData.email !== undefined) user.email = updateData.email;

    // 3. Save user first (to keep consistent)
    await this.userRepository.save(user);

    // 4. Update profile fields (bio, avatar)
    const profile = await user.profile;
    if (profile) {
      if (updateData.bio !== undefined) profile.bio = updateData.bio;
      if (updateData.avatar !== undefined) profile.avatar = updateData.avatar;
      await this.profileRepository.save(profile);
    } else {
      // Profile doesn't exist — create one linked to this user
      const newProfile = this.profileRepository.create({
        bio: updateData.bio ?? '',
        avatar: updateData.avatar ?? '',
        user: Promise.resolve(user),
        userId: user.id,
      });
      await this.profileRepository.save(newProfile);
      user.profile = Promise.resolve(newProfile);
    }

    return user;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    // result.affected tells how many rows were deleted
    return !!result.affected;
  }
}
