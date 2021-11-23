import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const users: User[] = [];
  beforeEach(async () => {
    // create fake copy of the users service
    fakeUsersService = {
      // find: () => Promise.resolve([]),
      // more intelligent way to test the sign in function
      find: (email: string) => {
        const filteredUser = users.filter((user) => user.email == email);
        return Promise.resolve(filteredUser);
      },
      create: (email: string, password: string) => {
        // Promise.resolve({ id: 1, email, password } as User),
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();
    service = module.get(AuthService);
  });
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@gmail.com', '123456789');
    expect(user.password).not.toEqual('123456789');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  /*  it('throw an error if user sign up with email that is in use ', async (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    try {
      await service.signup('hhgggffdd@gmail.com', 'asdf');
    } catch (err) {
      done();
    }
  });*/

  /* it('throws if sign in is called with an used email ', async (done) => {
    /!*try {*!/
    await new Promise<void>((resolve, reject) => {
      try {
        service.signin('flfkf@fkkf.com', 'fkfkk');
        resolve();
      } catch (err) {
        reject(err);
      }
    });
    /!* done();
    } catch (err) {
      done(err);
    }*!/
  }, 100000);*/

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  it('return a user if correct password is provided ', async () => {
    /*  fakeUsersService.find = () =>
      // we need to get the hashed password   this is why i make console.log to get the hashed password
      Promise.resolve([
        {
          email: 'kfjkff@fkkg.com',
          password:
            '26d838df873b002e.a3bf4c25402d4e9bcfd314c6f31c51e8451236e30058302edbe404d03b440d29',
        } as User,
      ]);*/
    await service.signup('kfjkff@fkkg.com', 'fkfkfk');
    const user = await service.signin('kfjkff@fkkg.com', 'fkfkfk');
    expect(user).toBeDefined();
    /*    const user = await service.signup('kfjkff@fkkg.com', 'fkfkfk');
    console.log(user);*/
  });
});
