import { ArgumentsHost, Catch, NotFoundException } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements GqlExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    GqlArgumentsHost.create(host);
    return new NotFoundException('Entity not found');
  }
}
