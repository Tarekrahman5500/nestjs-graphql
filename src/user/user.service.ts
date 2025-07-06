import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile, User, UserRole } from '../entity';
import { Repository } from 'typeorm';
import { UserCreateInputDto } from './dto/user.create.input.dto';
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
  async create(userData: UserCreateInputDto): Promise<User> {
    // 1. Create and save user
    const user = this.userRepository.create({
      role: UserRole.USER,
      username: userData.username,
      email: userData.email,
    });
    const savedUser = await this.userRepository.save(user);

    //   console.log(savedUser);

    // 2. Create and save profile with bio and avatar
    const profile = this.profileRepository.create({
      bio: userData.bio,
      avatar: userData.avatar,
      userId: savedUser.id, // optional but good for batching later
    });
    // ✅ Step 3: Set lazy relation AFTER creation
    profile.user = Promise.resolve(savedUser); // or cast properly if needed
    // console.log(profile);
    await this.profileRepository.save(profile);
    // console.log('here');
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
