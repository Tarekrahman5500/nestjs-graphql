import { UserRole } from '../enums/role.enum';

export type JwtUser = {
  userId: number;
  role: UserRole;
};
