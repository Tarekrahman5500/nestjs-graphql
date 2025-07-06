import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post, Profile, User } from '../entity';
import { UserService } from './user.service';
import { Logger, UseGuards } from '@nestjs/common';
import { ProfileLoaderService } from '../loader/profile.loader.service';
import { PostLoaderService } from '../loader/post.loader.service';

import { UserUpdateInputDto } from './dto/user.update.input.dto';
import { GqlJwtGuard } from '../auth/guards/gql-jwt-guard/gql-jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtUser } from '../types/jwt.user';

@Resolver(() => User)
export class UserResolver {
  private readonly logger = new Logger('UserResolver');

  constructor(
    private readonly userService: UserService,
    private readonly profileLoader: ProfileLoaderService,
    private readonly postsLoader: PostLoaderService,
  ) {}

  @Query(() => [User], { name: 'users' }) // correct return type
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(GqlJwtGuard)
  @Query(() => User, { name: 'user', nullable: true }) // correct return type
  async findOne(@CurrentUser() user: JwtUser): Promise<User> {
    this.logger.log(`Finding user with ID: ${user.userId}`);
    return await this.userService.findOne(user.userId);
  }

  @ResolveField(() => Profile)
  async profile(@Parent() user: User) {
    return this.profileLoader.batchProfiles.load(user.id);
  }

  @ResolveField(() => [Post])
  async posts(@Parent() user: User) {
    return this.postsLoader.batchPosts.load(user.id);
  }

  // now mutation for creation user
  /*  @Mutation(() => User, { name: 'userCreate', nullable: true })
  async createUser(
    @Args('userCreateInput') userCreateInput: UserCreateInputDto,
  ): Promise<User> {
    return await this.userService.create(userCreateInput);
  }*/

  @UseGuards(GqlJwtGuard)
  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @CurrentUser() user: JwtUser,
    @Args('userUpdateInput') userUpdateInput: UserUpdateInputDto,
  ): Promise<User> {
    console.log(user);
    return this.userService.update(user.userId, userUpdateInput);
  }

  @Mutation(() => Boolean, { name: 'userRemove' })
  async userRemove(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.userService.remove(id);
  }
}
