import { UserRole } from '../../enums/role.enum';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field(() => Int)
  userId: number;
  @Field(() => UserRole)
  role: UserRole;
  @Field()
  accessToken: string;
}
