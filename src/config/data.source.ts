import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategy';

const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`${__dirname}/../**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/../../migrations/*.{ts,js}`],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
};

export const ConfigDB = new DataSource(DataSourceConfig);

ConfigDB.initialize()
  .then(() => console.log('✅ Database connection established successfully'))
  .catch((error) => console.error('❌ Database connection failed:', error));
