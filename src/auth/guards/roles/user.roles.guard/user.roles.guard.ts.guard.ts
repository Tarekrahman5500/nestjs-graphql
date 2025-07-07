import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../../enums/role.enum';
import { ROLES_KEY } from '../../../../decorators/user.roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtUser } from '../../../../types/jwt.user';

@Injectable()
export class UserRolesGuardTsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireRoles) {
      return true; // If no roles are required, allow access
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext<{ req: { user: JwtUser } }>().req.user;
    // console.log(requireRoles, user);
    if (!user) return false;
    //console.log(user, requireRoles);
    return requireRoles.some((role) => user.role === role);
  }
}
