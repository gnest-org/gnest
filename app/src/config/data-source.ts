import pg from 'pg';
import { DataSource } from 'typeorm';
import { postgres } from './config';

export const AppDataSource = new DataSource({
  driver: pg,
  type: 'postgres',
  url: postgres.pgUrl,
  synchronize: true,
  entities: ["src/models/entities/*{.ts,.js}"],
  migrations: ["src/database/migrations/*{.ts,.js}"],
  subscribers: [],
});
