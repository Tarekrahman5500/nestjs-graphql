import { UserRole } from '../../../../enums/role.enum';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRoles } from '../../../../decorators/user.roles.decorator';
import { UserRolesGuardTsGuard } from './user.roles.guard.ts.guard';

export function AuthWithRoles(...roles: [UserRole, ...UserRole[]]) {
  return applyDecorators(UserRoles(...roles), UseGuards(UserRolesGuardTsGuard));
}
