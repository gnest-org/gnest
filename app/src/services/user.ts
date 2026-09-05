import { hash } from 'bcryptjs';
import { defaultUser } from '../config';
import { AppDataSource } from '../config';
import { CreateUser, GetUser, Role, User } from '../models';
import { TypeORM } from '../decorators';

const userRepository = AppDataSource.getRepository(User);

const initializeDefaultUser = async () => {
  const defaultUserOpt = await userRepository.findOneBy({
    email: defaultUser.email,
    username: defaultUser.username
  });

  if (!defaultUserOpt) {
    const hashedPassword = await hash(defaultUser.password, 10);

    const user = userRepository.create({
      username: defaultUser.username,
      email: defaultUser.email,
      password: hashedPassword,
      role: Role.ADMIN
    });

    await userRepository.save(user);
    logging.info('Default admin user created');
  } else {
    logging.info('Default admin user already exists');
  }
};

function formatUserInfo(user: any): GetUser {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
    email: user.email,
    createdAt: user.createdAt!.toLocaleString(),
    updatedAt: user.updatedAt!.toLocaleString()
  };
}

async function getAllUsers() {
  try {
    const users = await TypeORM.GetAll('users');
    return users.map((user) => formatUserInfo(user));
  } catch (error) {
    logging.error(error);
    new Error(
      'Error while getting all user' +
        { message: error instanceof Error ? error.message : 'Unexpected error' }
    );
  }
}

async function getUserById(id: number) {
  try {
    const user = await TypeORM.GetById('users', id);
    if (!user) return null;
    return formatUserInfo(user);
  } catch (error) {
    logging.error(error);
    new Error(
      'Error while getting user by id' +
        { message: error instanceof Error ? error.message : 'Unexpected error' }
    );
  }
}

async function createUser(users: CreateUser[]) {
  let usersCreated: GetUser[] = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    try {
      if (user.password != user.confirmPassword) {
        return new Error(
          `Error while creating user with username=${user.username}` +
            { message: 'Password don\'t mathc with confirm password' }
        );
      }
      const userCreated = await TypeORM.Create('users', user);
      if (!userCreated) null;
      else usersCreated.push(formatUserInfo(userCreated));
    } catch (error) {
      logging.error(error);
      new Error(
        `Error while creating user with username=${user.username}` +
          { message: error instanceof Error ? error.message : 'Unexpected error' }
      );
    }
  }
  return usersCreated;
}

async function getUserByQuery(queryParams: any) {
  try {
    let users = await TypeORM.Query('users', queryParams);
    if (users?.length === 0 || users === null) return [];
    return users.map((user) => formatUserInfo(user));
  } catch (error) {
    logging.error(error);
    new Error(
      'Error while getting user by username' +
        { message: error instanceof Error ? error.message : 'Unexpected error' }
    );
  }
}

async function updateUser(id: number, updatedData: User) {
  try {
    const user = await TypeORM.Update('users', id, updatedData);
    return formatUserInfo(user);
  } catch (error) {
    logging.error(error);
    new Error(
      'Error while updating user' +
        { message: error instanceof Error ? error.message : 'Unexpected error' }
    );
  }
}

async function deleteUser(id: number) {
  try {
    const isDeleted = await TypeORM.Delete('users', id);
    return isDeleted;
  } catch (error) {
    logging.error(error);
    new Error(
      'Error while deleting user' +
        { message: error instanceof Error ? error.message : 'Unexpected error' }
    );
  }
}

export const userService = {
  updateUser,
  deleteUser,
  createUser,
  getAllUsers,
  getUserById,
  getUserByQuery,
  formatUserInfo,
  initializeDefaultUser
};
