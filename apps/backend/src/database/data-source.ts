import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PracticeNode } from './entities/practice-node.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { UIComponent } from './entities/ui-component.entity';
import { Asset } from './entities/asset.entity';

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: configService.get('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USERNAME', 'postgres'),
  password: configService.get('DATABASE_PASSWORD', 'password'),
  database: configService.get('DATABASE_NAME', 'learning_practice'),
  entities: [PracticeNode, Category, Tag, UIComponent, Asset],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
});