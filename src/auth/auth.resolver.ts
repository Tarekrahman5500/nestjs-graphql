import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../entity';
import { UserCreateInputDto } from '../user/dto/user.create.input.dto';
import { AuthService } from './auth.service';
import { AuthPayload } from './payloads/auth.payload';
import { SignInDto } from './dto/sign.in.dto';
import { Public } from '../decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Mutation(() => User)
  async signUp(
    @Args('userCreateInput') input: UserCreateInputDto,
  ): Promise<User> {
    return this.authService.registerUser(input);
  }

  @Public()
  @Mutation(() => AuthPayload)
  async signIn(@Args('input') input: SignInDto): Promise<AuthPayload> {
    const user = await this.authService.validateLocalUser(input);
    return this.authService.login(user);
  }
}
