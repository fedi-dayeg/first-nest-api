import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          database: config.get<string>('DB_NAME'),
          host: '127.0.0.1',
          port: 5432,
          username: 'postgres',
          password: 'root',
          synchronize: true,
          entities: [User, Report],
          keepConnectionAlive: true,
        };
      },
    }),
    /* TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      database: 'db',
      port: 5432,
      username: 'postgres',
      password: 'root',
      synchronize: true,
      entities: [User, Report],
    }),*/
    UsersModule,
    ReportsModule,
  ],
})
export class AppModule {
  // run in every single incoming request
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdfasdf'],
        }),
      )
      // forRoutes for global Middleware
      .forRoutes('*');
  }
}
