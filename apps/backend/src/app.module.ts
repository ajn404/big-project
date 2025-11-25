import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';

import { DatabaseModule } from './database/database.module';
import { PracticeNodeModule } from './practice-node/practice-node.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { UIComponentModule } from './ui-component/ui-component.module';
import { AssetModule } from './asset/asset.module';
import { FolderModule } from './folder/folder.module';
import { SeedModule } from './database/seeds/seed.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 调度模块 - 启用定时任务
    ScheduleModule.forRoot(),

    // GraphQL 模块
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.GRAPHQL_PLAYGROUND === 'true',
      introspection: process.env.GRAPHQL_INTROSPECTION === 'true',
      context: ({ req, res }) => ({ req, res }),
    }),

    // 数据库模块
    DatabaseModule,

    // 业务模块
    PracticeNodeModule,
    CategoryModule,
    TagModule,
    UIComponentModule,
    AssetModule,
    FolderModule,
    
    // 种子数据模块
    SeedModule,
  ],
})
export class AppModule {}