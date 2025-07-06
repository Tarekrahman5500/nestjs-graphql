import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../entity';
import { UserCreateInputDto } from '../user/dto/user.create.input.dto';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async signUp(
    @Args('userCreateInput') input: UserCreateInputDto,
  ): Promise<User> {
    return this.authService.registerUser(input);
  }
}
