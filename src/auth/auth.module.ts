import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, Profile, Tag, User } from '../entity';
import { Argon2Service } from './argon2.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { envVariables } from '../config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Profile, Tag]),
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: envVariables.JWT_SECRET_KEY,
        signOptions: { expiresIn: envVariables.JIWT_EXPIRE_TIME },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, Argon2Service, JwtStrategy],
})
export class AuthModule {}
