import { registerEnumType } from '@nestjs/graphql';
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(UserRole, {
  name: 'UserRole', // This will be the enum name in GraphQL schema
  description: 'Roles for users', // Optional description
});
