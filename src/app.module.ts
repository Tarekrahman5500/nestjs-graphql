import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { configConstants, envConfiguration } from './config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { UserResolver } from './user/user.resolver';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm, envConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const config = configService.get<TypeOrmModuleOptions>(
          configConstants.TYPEORM,
        );

        if (!config) {
          throw new Error(
            `TypeORM config not found under key "${configConstants.TYPEORM}"`,
          );
        }

        return config;
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      debug: true,
      playground: true,
      introspection: true,
      path: '/graphql',
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserResolver],
})
export class AppModule {}
