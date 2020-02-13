import * as faker from "faker";
import User from "../../src/database/models/user";

export function userAttributes(
  attributeOverrides?: Partial<User>
): Partial<User> {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...attributeOverrides
  };
}

export default async function createUser(
  attributeOverrides?: Partial<User>
): Promise<User> {
  return User.create(userAttributes(attributeOverrides));
}
