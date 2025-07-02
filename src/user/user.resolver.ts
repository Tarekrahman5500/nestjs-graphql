import { Query, Resolver } from '@nestjs/graphql';
import { User } from '../entity';

@Resolver(() => User)
export class UserResolver {
  @Query(() => [User], { name: 'users' }) // correct return type
  findAll(): User[] {
    return [] as User[];
  }
}
