import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
/*import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';*/
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  // import the interceptor to access it
  providers: [
    UsersService,
    AuthService,
    // apply the interceptor in all the user directories
    // commented interceptor because we use the middleware
    /* {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },*/
  ],
})
export class UsersModule {
  /**
   * @param consumer
   * this function let us to activate the middleware
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
