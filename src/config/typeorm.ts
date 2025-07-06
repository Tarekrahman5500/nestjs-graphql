import { envVariables } from './env.schema';
import { registerAs } from '@nestjs/config';
import { configConstants } from './config.constants';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource, DataSourceOptions } from 'typeorm';

// TypeORM DataSource configuration

//console.log(envVariables);
export const dataSourceConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: envVariables.DATABASE_HOST,
  port: envVariables.DATABASE_PORT,
  username: envVariables.DATABASE_USERNAME,
  password: envVariables.DATABASE_PASSWORD,
  database: envVariables.DATABASE_NAME,
  synchronize: false,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
};

export default registerAs(
  configConstants.TYPEORM,
  (): PostgresConnectionOptions => dataSourceConfig,
);

export const connectionSource = new DataSource(
  dataSourceConfig as DataSourceOptions,
);
