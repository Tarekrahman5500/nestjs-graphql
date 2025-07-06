import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserCreateInputDto } from 'src/user/dto/user.create.input.dto';
import { Profile, User } from '../entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Argon2Service } from './argon2.service';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign.in.dto';
import { AuthJwtPayload } from '../types/auth.jwt.payload';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './payloads/auth.payload';
import { JwtUser } from '../types/jwt.user';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hasher: Argon2Service,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

  async validateLocalUser(input: SignInDto) {
    const user = await this.userService.getUserByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // console.log(user);

    const isPasswordValid = await this.hasher.verify(
      user.password,
      input.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }

  async generateToken(userId: number) {
    const payload: AuthJwtPayload = {
      sub: {
        userId,
      },
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
    };
  }

  async login(user: User): Promise<AuthPayload> {
    const { accessToken } = await this.generateToken(user.id);
    return {
      userId: user.id,
      role: user.role,
      accessToken,
    };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const jwtUser: JwtUser = {
      userId: user.id,
      role: user.role,
    };
    return jwtUser;
  }
}
