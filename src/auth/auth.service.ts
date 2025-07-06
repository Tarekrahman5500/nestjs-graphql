import { Injectable } from '@nestjs/common';
import { UserCreateInputDto } from 'src/user/dto/user.create.input.dto';
import { Profile, User } from '../entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Argon2Service } from './argon2.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hasher: Argon2Service,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly userService: UserService,
  ) {}

  async registerUser(input: UserCreateInputDto): Promise<User> {
    const hashedPassword = await this.hasher.hash(input.password);
    const user = this.userRepository.create({
      ...input,
      password: hashedPassword,
    });

    // 2. Create and save profile with bio and avatar
    const profile = this.profileRepository.create({
      bio: input.bio,
      avatar: input.avatar,
      userId: user.id, // optional but good for batching later
    });
    return this.userService.create(user, profile);
  }
}
