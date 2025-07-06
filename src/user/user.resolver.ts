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
import { Logger } from '@nestjs/common';
import { ProfileLoaderService } from '../loader/profile.loader.service';
import { PostLoaderService } from '../loader/post.loader.service';
import { UserCreateInputDto } from './dto/user.create.input.dto';
import { UserUpdateInputDto } from './dto/user.update.input.dto';

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

  @Query(() => User, { name: 'user', nullable: true }) // correct return type
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<User> {
    this.logger.log(`Finding user with ID: ${id}`);
    return await this.userService.findOne(id);
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
  @Mutation(() => User, { name: 'userCreate', nullable: true })
  async createUser(
    @Args('userCreateInput') userCreateInput: UserCreateInputDto,
  ): Promise<User> {
    return await this.userService.create(userCreateInput);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('userUpdateInput') userUpdateInput: UserUpdateInputDto,
  ): Promise<User> {
    return this.userService.update(id, userUpdateInput);
  }

  @Mutation(() => Boolean, { name: 'userRemove' })
  async userRemove(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.userService.remove(id);
  }
}
