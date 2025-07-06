import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class UserCreateInputDto {
  @MinLength(3)
  @Field()
  username: string;

  @IsString()
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Field()
  bio: string;

  @IsString()
  @Field()
  avatar: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}
