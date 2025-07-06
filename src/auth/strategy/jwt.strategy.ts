import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envVariables } from '../../config';
import { AuthService } from '../auth.service';
import { AuthJwtPayload } from '../../types/auth.jwt.payload';
import { JwtUser } from '../../types/jwt.user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envVariables.JWT_SECRET_KEY,
    });
  }

  async validate(payload: AuthJwtPayload): Promise<JwtUser> {
    const { userId } = payload.sub;
    return await this.authService.validateJwtUser(userId);
  }
}
