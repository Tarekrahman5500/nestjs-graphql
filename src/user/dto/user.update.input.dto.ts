import { InputType, PartialType } from '@nestjs/graphql';
import { UserCreateInputDto } from './user.create.input.dto';

@InputType()
export class UserUpdateInputDto extends PartialType(UserCreateInputDto) {}
