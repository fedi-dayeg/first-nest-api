import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'fedi@gmail.com',
          password: '1234',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '1234' } as User]);
      },
      /*remove: (id: number) => {},
      update: (id: number, attrs: Partial<User>) => {}*/
    };
    fakeAuthService = {
      /* signup: (email: string, password: string) => {
        return Promise.resolve();
      },*/
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('findAllUsers return a list os users with the given email', async () => {
    const users = await controller.findAllUsers('asde@asdef.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asde@asdef.com');
  });

  it('findUser return a single user with the given id ', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found ', async () => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findUser('1');
    } catch (err) {}
  });

  /*it('sign in update session object and return user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'fedi@gmail.com', password: 'asdf' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });*/
});
